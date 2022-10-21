// React entry point 会自动根据endpoints生成hooks
import { baseApi } from "./base";
interface IPostVo {
  id: number;
  name: string;
}
const loginApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 登录
    login: builder.mutation({
      query: (data) => ({
        url: `/auth/login`,
        method: "post",
        body: data
      })
    })
  }),
  overrideExisting: false
});
// 导出可在函数式组件使用的hooks,它是基于定义的endpoints自动生成的
export const { useLoginMutation } = loginApi;
export default loginApi;
