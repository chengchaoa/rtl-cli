import { baseApi } from './base.service';
interface IAccountVo {
  id: number;
  username: string;
  age: number;
}
const accountApi = baseApi.injectEndpoints({
  // reducerPath: 'accountApi',
  // baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000' }),
  // tagTypes: ['account'],
  endpoints: (builder) => ({
    // 查询账号
    accountList: builder.query<Promise<IAccountVo[]>, void>({
      query: () => '/account',
      transformResponse: (response: { result: Promise<IAccountVo[]> }) => {
        console.log(response.result, '中间层');
        return response.result;
      },
    }),
  }),
  overrideExisting: false,
});
export const { useLazyAccountListQuery, useAccountListQuery } = accountApi;
export default accountApi;
