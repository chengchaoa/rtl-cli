import { storage } from "@/utils/storage";
import { OnRouteBeforeType, MetaType, RoutesItemType } from "react-router-waiter";
import routes from "@/router";
import { compose, filter, not, isEmpty, last } from "ramda";

const onRouteBefore: OnRouteBeforeType = ({ pathname, meta }: { pathname: string; meta: MetaType }) => {
  // 动态修改页面title
  if (meta.title !== undefined) {
    document.title = meta.title;
  }

  // const needLogin = isNeedLogin(pathname);
  // // 登录及权限判断
  // if (needLogin) {
  //   const token: string = storage.getItem("token") || "";
  //   // 路由是否需要登录
  //   if (token) {
  //     return logined(pathname, meta);
  //   } else {
  //     return `/login?redirect=${encodeURIComponent(window.location.href)}`;
  //   }
  // }
};

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

/**
 * 获取路由路径和路由meta字段的映射数据
 */
export function getFlatRoutes() {
  const getMap: any = (routeMenuList = [], prePath = "") => {
    let map = {};
    routeMenuList.forEach((v: any) => {
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

const getUserInfo = () => {
  const userInfoString: string = storage.getItem("userInfo") || "{}";
  let userInfo: Record<string, any> = {};

  try {
    userInfo = JSON.parse(userInfoString);
  } catch (e) {
    return {};
  }
  return userInfo;
};

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
  // if (isAdmin(userInfo.roles)) return true;
  // const currentPath = last(location.pathname.split("/"));
  // let isHas = false;
  // const recursion = (list: Array<any>) => {
  //   if (isHas) return;
  //   for (let index = 0; index < list.length; index++) {
  //     const item = list[index];

  //     if (userInfo?.permissions?.some((val: string) => val === item.key && item.path === currentPath)) {
  //       isHas = true;
  //     }

  //     if (item.children) {
  //       recursion(item.children);
  //     }
  //   }
  // };

  // recursion(getAuthTree());

  // return isHas;
  return true;
};

// 获取router菜单列表
export const getAuthTree = () => {
  const tree: Array<any> = [];
  const recursion = (list: Array<any>, tr: Array<any>, parentKey = "") => {
    for (let index = 0; index < list.length; index++) {
      const item = list[index];
      const key = parentKey ? `${parentKey}-${index}` : `${index}`;
      const data = {
        title: item.meta.title,
        key,
        path: item.path,
        icon: item.meta.icon,
        disabled: item.meta.disabled
      };
      if (item.children) {
        (data as any).children = [];
        recursion(item.children, (data as any).children, key);
      }
      tr.push(data);
    }
  };
  const list = routes.find((item: any) => item.path === "/")?.children;
  recursion(list as any, tree);
  return tree;
};

// 获取layout左侧menu列表
export const getMenuList = (pathname: string) => {
  const routeMenuList = getAuthTree();

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

  const getMenuList = (list: Array<any>, parentKey = "", parentTitle: any[] = []) => {
    const menuList: Array<any> = [];
    list.forEach((item: any) => {
      const resItem = {
        index: item.key,
        key: `${parentKey}/${item.path}`,
        label: item.title,
        icon: item.icon,
        title: [...parentTitle, item.title]
      };
      if (typeof item.disabled === "boolean") {
        (resItem as any).disabled = item.disabled;
      }
      if (item.children && item.children.length) {
        (resItem as any).children = getMenuList(item.children, resItem.key, resItem.title);
      }
      menuList.push(resItem);
    });
    return menuList;
  };
  const menuList = getMenuList(routeMenuList);

  return {
    menuList
  };
};

export default onRouteBefore;
