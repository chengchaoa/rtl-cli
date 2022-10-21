import axios, { AxiosRequestConfig } from "axios";
import { mergeDeepRight, type } from "ramda";
import { message as toast } from "antd";

import { storage } from "@/utils/storage";

interface AxiosReqConfig extends AxiosRequestConfig {
  noNeedLogin?: boolean;
  timestamp?: number;
}

const paramsList = ["get"];
const dataList = ["put", "post", "delete"];

// todo 全局loading
const loadingKey: Array<number> = [];

// 关闭全局loading
const closeLoading = (timestamp: number | undefined) => {
  if (!(type(timestamp) === "Number")) return;

  const index = loadingKey.findIndex((item: number) => item === timestamp);
  if (index >= 0) {
    toast.destroy(timestamp);
    loadingKey.splice(index, 1);
  }
};

// 请求
const request = (url: string, req: Record<string, any> = {}, conf: AxiosReqConfig = {}) => {
  const token = storage.get("token");
  if (!token && !conf.noNeedLogin) {
    goLogin("未登录请登录");
    return;
  }

  if (!conf.noNeedLogin) {
    const timestamp = Date.now();
    conf.timestamp = timestamp;
    toast.loading({
      content: "fetching",
      duration: 0,
      key: timestamp
    });
    loadingKey.push(timestamp);
  }

  const isLocal = process.env.NODE_ENV === "development";
  let rewriteUrl = url;
  if (!isLocal) {
    rewriteUrl = rewriteUrl.replace("/api", "");
  }

  const defConf: AxiosReqConfig = {
    url: rewriteUrl,
    method: "post", // 默认GET
    baseURL: isLocal ? "/" : process.env.REACT_APP_API,
    headers: {
      // "X-HTTP-Method-Override": conf.customMethon,
      "Content-Type": "application/json; charset=utf-8",
      "X-Forwarded-For": storage.get("ip") || "",
      "X-Access-Token": token,
      "Access-Control-Allow-Origin": "*",
      withCredentials: true,
      crossDomain: true
    },
    timeout: conf.timeout
  };
  if (paramsList.includes(conf.method as string)) {
    defConf.params = req;
  } else if (dataList.includes(conf.method as string)) {
    defConf.data = req;
  }

  const mergeConf = mergeDeepRight(defConf, conf) as AxiosRequestConfig;

  return new Promise((resolve, reject) => {
    axios
      .request(mergeConf)
      .then((res) => {
        closeLoading(conf.timestamp);
        resolve(res.data);
      })
      .catch((error) => {
        closeLoading(conf.timestamp);
        if (type(error) === "String") {
          toast.error(error);
        } else if (error?.message) {
          toast.error(error.message);
        } else {
          try {
            toast.error(JSON.stringify(error.message));
          } catch (e) {
            // message.error('')
            console.log("axios catch JSON.stringify err");
          }
        }

        reject(error);
      });
  });
};

// 请求拦截
axios.interceptors.request.use(
  (config) => {
    // 过滤空数据字段
    const data = dataList.includes(config.method as string) ? config.data : config.params;
    Object.keys(data).forEach((key) => {
      if (["", undefined, null].includes(data[key])) delete data[key];
    });

    config.data = JSON.stringify(config.data);
    return config;
  },
  (error) => {
    console.log("axios request error", error);
    return Promise.reject(error);
  }
);

const responseAction = (res: any) => {
  const { code, message } = res;
  if (code !== 0) {
    switch (res.message) {
      case "ACCESS_TOKEN_EXPIRED":
      case "INVALID_ACCESS_TOKEN": // token失效
        goLogin("登录失效请重新登陆");
        break;
      // case "MISSING_ARGUMENT": // 无效的参数。
      // case "INVALID_BRAND": // 无效的游戏商代码
      // case "INVALID_SESSION": // 无效的工作阶段识别码
      // case "INVALID_ROUND_ID": // 无效的回合单号
      // case "DUPLICATED_OPERATION": // 重复操作
      // case "INSUFFICIENT_BALANCE": // 余额不足
      // case "MISSING_ACCOUNT": // 指定的帐户不存在。
      // case "MISSING_ROLE": // 指定的角色不存在。
      // case "PERMISSION_DENIED": // 权限不足。
      case "NO_CONTENT":
        break;
      default:
        toast.error(message);
    }
  }
};

// 响应拦截
axios.interceptors.response.use(
  (response) => {
    const res = response?.data;
    responseAction(res);
    return response;
  },
  (error) => {
    if (error && error.response) {
      const { message } = error?.response?.data || error?.message || {};
      responseAction({ message });
      switch (message) {
        case "ACCESS_TOKEN_EXPIRED":
        case "INVALID_ACCESS_TOKEN": // token失效
          goLogin("登录失效请重新登陆");
          break;
        // case "MISSING_ARGUMENT": // 无效的参数。
        // case "INVALID_BRAND": // 无效的游戏商代码
        // case "INVALID_SESSION": // 无效的工作阶段识别码
        // case "INVALID_ROUND_ID": // 无效的回合单号
        // case "DUPLICATED_OPERATION": // 重复操作
        // case "INSUFFICIENT_BALANCE": // 余额不足
        // case "MISSING_ACCOUNT": // 指定的帐户不存在。
        // case "MISSING_ROLE": // 指定的角色不存在。
        // case "PERMISSION_DENIED": // 权限不足。
        case "NO_CONTENT":
          break;
        default:
          toast.error(message);
      }
      const msgDesc = message;
      throw msgDesc;
    }
    console.log("axios response error");
    return Promise.reject(error);
  }
);

const goLogin = (message: string) => {
  storage.del("token"); // 清除token
  toast.error(message);
  setTimeout(() => {
    // 跳转到登录页, 带上登录后重定向本页面路径参数
    const pathname = window.location.pathname;
    if (pathname !== "/" && pathname !== "") {
      window.location.href = window.location.origin + `/login?redirect=${encodeURIComponent(window.location.href)}`;
    }
  }, 3000);
};

export default request;
