import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchWithIntercept } from "./intercept/fetchIntercept";

export const baseApi = createApi({
  baseQuery: fetchWithIntercept,
  reducerPath: "baseApi",
  // 缓存时间，以秒为单位，默认是60秒
  // keepUnusedDataFor: 2 * 60,
  // refetchOnMountOrArgChange: 30 * 60,
  endpoints: () => ({})
});
