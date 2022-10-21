import { QueryReturnValue } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
  FetchBaseQueryMeta
} from "@reduxjs/toolkit/query/react";

// 定义拦截器 参考文档:https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#automatic-re-authorization-by-extending-fetchbasequery
const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/",
  prepareHeaders: (headers, { getState }) => {
    // const token = (getState() as RootState).auth.token;
    headers.set("token", "97aca8cabd58406db9afc7a094a57584");
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
  console.log(result, "拦击器");
  const { data, error } = result;
  // 如果遇到错误的时候
  if (error) {
    const { status, data } = error;
    // 根据状态来处理错误
    console.log(status, "http的状态码");
    throw new Error((data as any)?.message);
  }
  if (Object.is(data?.code, 0)) {
    return result;
  }
  throw new Error(data.message);
};

export const baseApi = createApi({
  baseQuery: baseQueryWithIntercept, // fetchBaseQuery({ baseUrl: 'http://localhost:5000' }),
  reducerPath: "baseApi",
  // 缓存时间，以秒为单位，默认是60秒
  keepUnusedDataFor: 2 * 60,
  // refetchOnMountOrArgChange: 30 * 60,
  endpoints: () => ({})
});
