import { QueryReturnValue } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
  FetchBaseQueryMeta
} from "@reduxjs/toolkit/query/react";

import { storage } from "@/utils";
import { authToken } from "src/constants";
import { printHttpError, printPanel } from "./printHttpError";

const baseUrl: string = process.env.REACT_APP_BASE_API_URL as string;

// 定义返回数据类型
interface IResultData {
  code: number;
  message: string;
  result?: Record<string, unknown> | number | string;
}
// 请求
const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    headers.set("x-origin", "merchant-center");
    headers.set("x-org-id", "4");
    const token: string = storage.getItem(authToken);
    if (token) {
      headers.set(authToken, token);
    }
    return headers;
  }
});
// 定义拦截器 参考文档:https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#automatic-re-authorization-by-extending-fetchbasequery
// 请求的拦截器
export const fetchWithIntercept: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result: QueryReturnValue<any, FetchBaseQueryError, FetchBaseQueryMeta> = await baseQuery(
    args,
    api,
    extraOptions
  );
  console.log(result, "拦击器");
  const { data, error, meta } = result;
  const { request } = meta as FetchBaseQueryMeta;
  const { code, message } = data as IResultData;
  const url: string = request.url;
  // 如果遇到httpStatus!=200-300错误的时候
  if (error) {
    const { status } = error as FetchBaseQueryError;
    // 根据状态来处理错误
    printHttpError(Number(status), url);
  }
  // 正确的时候，根据各自后端约定来写的
  if (Object.is(code, 0)) {
    return result;
  } else {
    // TODO 打印提示信息
    printPanel({ method: request.method, url: request.url });
    // TODO 根据后端返回的错误提示到组件中,直接这里弹框提示也可以
    return Promise.reject(message);
  }
};
