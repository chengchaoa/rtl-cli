import { compose, filter, not, isEmpty, last } from "ramda";
import { routes } from "@/router";
// todo 动态引入当前语言
import { MetaType, OnRouteBeforeType, RoutesItemType } from "@/components/AuthRouter/types";
import { storage } from "@/utils/storage";

/**
 * 获取路由路径和路由meta字段的映射数据
 */
export function getFlatRoutes() {
  const getMap: any = (routeMenuList = [], prePath = "") => {
    let map = {};
    routeMenuList.forEach((v: RoutesItemType) => {
      v.meta = v.meta || {};
      if (v.redirect || v.path === "*" || v.path === undefined) {
        return;
      }
      let currentPath = prePath + v.path;
      if (v.path === "/") {
        currentPath = "";
      } else {
        map = {
          ...map,
          [currentPath]: v.meta || {}
        };
      }
      if (v.children) {
        map = {
          ...map,
          ...getMap(v.children, currentPath + "/")
        };
      }
    });
    return map;
  };
  return getMap(routes);
}

const isAdmin = (roles: Array<string>) => {
  if (roles?.some((item: string) => item === "admin")) return true;
  return false;
};

/**
 * todo 需要优化
 * @description: 获取是否具有权限
 * @return {boolean}
 */

export const hasAuth = (userInfo: Record<string, any>) => {
  if (isAdmin(userInfo.roles)) return true;
  const currentPath = last(location.pathname.split("/"));
  let isHas = false;
  const recursion = (list: Array<any>) => {
    if (isHas) return;
    for (let index = 0; index < list.length; index++) {
      const item = list[index];
      const aaa = (val: string) => {
        return val === item.key && item.path === currentPath;
      };

      if (userInfo?.permissions?.some(aaa)) {
        isHas = true;
      }

      if (item.children) {
        recursion(item.children);
      }
    }
  };

  recursion(getAuthTree());

  return isHas;
};

/**
 * @description: 根据url解析出路由path路径
 * @param {string} url 默认取当前页面地址
 * @param {boolean} isIncludeParams 是否需要包含路由参数，便于路由跳转携带数据
 * @return {string}
 */
export function getRoutePath(url = "", isIncludeParams = false) {
  url = url || window.location.href;
  const divideStr = process.env.PUBLIC_URL + "/";
  const reg = new RegExp(`//[\\w-\\.:]+${divideStr}(.*)*`);
  const match = url.match(reg) || [];
  const pathWithParams = "/" + (match[1] || "");
  if (!isIncludeParams) {
    return pathWithParams;
  } else {
    const path = pathWithParams.split("?")[0];
    return path;
  }
}

/**
 * 判断当前路由是否需要登录
 * @param path 路由路径
 * @returns
 */
const isNeedLogin = (path: string) => {
  const routeMenuList = getFlatRoutes();
  if (["login", "/login", "/403", "/404"].includes(path)) return false;
  const currentPath = path.length === 0 ? "/" : path;
  if (!routeMenuList[currentPath]?.meta?.noLogin) return true;

  // const pathArr = path.split("/");
  // let routePath = "";
  // for (let i = 0; i < pathArr.length; i++) {
  //   const currentPath = pathArr[i].length === 0 ? "/" : "";
  //   routePath = routePath + currentPath + currentPath;
  //   if (!routeMenuList[routePath]?.meta?.noLogin) return true;
  // }

  return false;
};

const getUserInfo = () => {
  const userInfoString: string = localStorage.getItem("userInfo") || "{}";
  let userInfo: Record<string, any> = {};

  try {
    userInfo = JSON.parse(userInfoString);
  } catch (e) {
    return {};
  }
  return userInfo;
};

/**
 * 登陆之后的操作
 * @param pathname
 * @param meta
 * @param userStore
 * @returns
 */
const logined = (pathname: string, meta: MetaType) => {
  // 用户是否已登录
  const message = `${pathname}，${meta.title || ""}`;
  const path403 = `/403?message=${encodeURIComponent(message)}`;
  const userInfo = getUserInfo();

  if (isAdmin(userInfo?.roles)) return;
  if (isEmpty(userInfo?.permissions)) return path403;

  /**
   * 是否已获取到用户（权限）信息
   * todo
   * 是否需要重新请求全新信息，可能缓存的权限信息被修改
   * 权限被修改之后如何同步最新的权限待商讨
   */
  if (userInfo.permissions) {
    const aaa = hasAuth(userInfo);
    if (!aaa && location.pathname !== "/403") return path403;
    // return new Promise((resolve) => {
    //   /**
    //    * 伪代码
    //    * 去取用户信息
    //    */
    //   setTimeout(() => {
    //     const data = {
    //       isGotUserInfo: {},
    //       accessIdList: ["10000", "10001", "10002"],
    //       isLogin: true
    //     };
    //     localStorage.setItem("userStore", JSON.stringify(data));
    //     if (!getIsCanAccess(accessId)) {
    //       resolve(path403);
    //     }
    //   }, 3000);
    // });
  } else {
    if (location.pathname !== "/403") {
      return path403;
    }
  }
};

/**
 * @description: 全局路由拦截
 * @param {string} pathname 当前路由路径
 * @param {object} meta 当前路由自定义meta字段
 * @return {string} 需要跳转到其他页时，就返回一个该页的path路径，或返回resolve该路径的promise对象
 */
export const onRouteBefore: OnRouteBeforeType = ({ pathname, meta }: { pathname: string; meta: MetaType }) => {
  const token: string = storage.getItem("token") || "";

  // 动态修改页面title
  if (meta.title !== undefined) {
    document.title = meta.title;
  }

  const needLogin = isNeedLogin(pathname);
  // 登录及权限判断
  if (needLogin) {
    // 路由是否需要登录
    if (token) {
      return logined(pathname, meta);
    } else {
      return `/login?redirect=${encodeURIComponent(window.location.href)}`;
    }
  }
};

export const fiflterAuth = () => {
  const userInfo = getUserInfo();

  if (isAdmin(userInfo?.roles)) {
    return getAuthTree();
  }

  const tree: Array<any> = [];
  const recursion = (list: Array<any>, parentIndex: string, tr: Array<any>) => {
    for (let index = 0; index < list.length; index++) {
      const item = list[index];
      const key = parentIndex ? `${parentIndex}-${index}` : `${index}`;
      const data = {
        title: item.meta.title,
        key,
        path: item.path
      };

      if (item.children) {
        (data as any).children = [];
        recursion(item.children, key, (data as any).children);
      }
      const aaa = (val: string) => {
        return val === data.key;
      };

      if (userInfo?.permissions?.some(aaa) || parentIndex === "") {
        tr.push(data);
      }
    }
  };

  recursion(routes[0].children as any, "", tree);
  return tree;
};

// 获取layout左侧menu列表
export const getMenuList = (pathname: string) => {
  const routeMenuList = fiflterAuth().filter((item: any) => !isEmpty(item.children));
  if (isEmpty(routeMenuList)) {
    return {};
  }
  const routeNest = filter(compose(not, isEmpty), pathname.split("/")) || [];

  let indexMenuPath: any; // menu选中路由
  const currentMenuRoute = routeMenuList.find(
    (item: any) => item.path === (routeNest as any)[0] || "/" + item.path === (routeNest as any)[0]
  );

  if (currentMenuRoute) {
    indexMenuPath = currentMenuRoute.path;
  } else {
    const defaultRoute = routeMenuList.find((item: any) => item.index);
    if (defaultRoute) indexMenuPath = defaultRoute.path;
  }

  if (!indexMenuPath) {
    indexMenuPath = routeMenuList[0]?.path;
  }

  const menuList = routeMenuList.map((item: any) => {
    return {
      path: "/" + item.path,
      title: item?.title
    };
  });
  const items = menuList.map((item: any) => ({
    key: item.path,
    label: item.title
  }));

  const currentNavRoute = routeMenuList.find((item: any) => item.path === indexMenuPath);

  const navList = currentNavRoute.children;
  let currentNavPath;
  if (routeNest[1]) {
    const currentNavRoute = navList.find(
      (item: any) => item.path === (routeNest as any)[1] || "/" + item.path === (routeNest as any)[1]
    );
    if (currentNavRoute) {
      currentNavPath = currentNavRoute.path;
    }
  } else {
    currentNavPath = navList.find((item: any) => item?.index)?.path;
  }
  if (!currentNavPath) {
    currentNavPath = navList[0]?.path;
  }

  return {
    menuList: items,
    currentMenuPath: indexMenuPath,
    navList: navList.map((item: any) => ({
      key: item.path,
      label: item?.title
    })),
    currentNavPath
  };
};

export const getAuthTree = () => {
  const tree: Array<any> = [];
  const recursion = (list: Array<any>, parentIndex: string, tr: Array<any>) => {
    for (let index = 0; index < list.length; index++) {
      const item = list[index];
      const key = parentIndex ? `${parentIndex}-${index}` : `${index}`;
      const data = {
        title: item.meta.title,
        key,
        path: item.path
      };

      if (item.children) {
        (data as any).children = [];
        recursion(item.children, key, (data as any).children);
      }

      tr.push(data);
    }
  };

  recursion(routes[0].children as any, "", tree);
  return tree;
};
