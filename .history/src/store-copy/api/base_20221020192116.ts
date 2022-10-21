import { QueryReturnValue } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
  FetchBaseQueryMeta
} from "@reduxjs/toolkit/query/react";
import { storage } from "@/utils/storage";

const baseUrl = process.env.REACT_APP_API;

// 设置拦截器
const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json; charset=utf-8");
    headers.set("X-Forwarded-For", storage.getItem("ip") || "");
    headers.set("X-Access-Token", storage.getItem("token") || "");
    headers.set("Access-Control-Allow-Origin", "*");
    return headers;
  }
});
const baseQueryWithIntercept: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result: QueryReturnValue<any, FetchBaseQueryError, FetchBaseQueryMeta> = await baseQuery(
    args,
    api,
    extraOptions
  );
  console.log(result, "拦截器");
  const { data, error, meta } = result;
  // 如果遇到错误的时候
  if (error) {
    const { status } = error as FetchBaseQueryError;
    const { request } = meta as FetchBaseQueryMeta;
    const url: string = request.url;
    // 根据状态来处理错误
    printHttpError(Number(status), url);
    // TODO 自己处理错误信息提示给前端
  }
  if (Object.is(data?.code, 0)) {
    return result;
  }
  throw new Error(data.message);
};

export const baseApi = createApi({
  baseQuery: baseQueryWithIntercept,
  reducerPath: "baseApi",
  // 缓存时间，以秒为单位，默认是60秒
  // keepUnusedDataFor: 2 * 60,
  // refetchOnMountOrArgChange: 30 * 60,
  endpoints: () => ({})
});

const printHttpError = (httpStatus: number, path: string): void => {
  switch (httpStatus) {
    case 400:
      console.log(`错误的请求:${path}`);
      break;
    // 401: 未登录
    // 未登录则跳转登录页面，并携带当前页面的路径
    case 401:
      console.log("你没有登录,请先登录");
      window.location.reload();
      break;
    // 跳转登录页面
    case 403:
      console.log("登录过期，请重新登录");
      // 清除全部的缓存数据
      window.localStorage.clear();
      window.location.reload();
      break;
    // 404请求不存在
    case 404:
      console.log("网络请求不存在");
      break;
    // 其他错误，直接抛出错误提示
    default:
      console.log("我也不知道是什么错误");
      break;
  }
};
