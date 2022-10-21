// React entry point 会自动根据endpoints生成hooks
import { postsSlice } from "@/store/slice/post.slice";
import { baseApi } from "../index.service";
export interface IPostVo {
  id: number;
  name: string;
}
// 使用base URL 和endpoints 定义服务
const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // query post list
    getPostsList: builder.query<Promise<IPostVo[]>, void>({
      query: () => "/posts",
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        console.log(id, "current id");
        // `onStart` side-effect
        // dispatch(messageCreated('Fetching post...'));
        try {
          const { data } = await queryFulfilled;
          console.log(data, "===onQueryStarted方法====");
          dispatch(postsSlice.actions.setPosts(data));
          // `onSuccess` side-effect
          // dispatch(messageCreated('Post received!'));
        } catch (err) {
          // `onError` side-effect
          // dispatch(messageCreated('Error fetching post!'));
        }
      },
      transformResponse: (response: { result: Promise<IPostVo[]> }) => {
        return response.result;
      }
    }),
    // 根据id去查询,第一个参数是返回值的类型，第二个参是传递给后端的数据类型
    getPostsById: builder.query<{ id: number; name: string }, number>({
      query: (id: number) => `/posts/${id}`
    }),
    // 创建帖子
    createPosts: builder.mutation({
      query: (data: IPostVo) => ({
        url: "/posts",
        method: "post",
        body: data
      })
    }),
    // 根据id删除帖子
    deletePostById: builder.mutation({
      query: (id: number) => ({
        url: `/posts/${id}`,
        method: "delete"
      })
    }),
    // 根据id修改帖子
    modifyPostById: builder.mutation({
      query: ({ id, data }: { id: number; data: any }) => ({
        url: `posts/${id}`,
        method: "PATCH",
        body: data
      })
    })
  }),
  overrideExisting: false
});
// 导出可在函数式组件使用的hooks,它是基于定义的endpoints自动生成的
export const {
  useGetPostsListQuery,
  useGetPostsByIdQuery,
  useCreatePostsMutation,
  useDeletePostByIdMutation,
  useModifyPostByIdMutation,
  // 惰性的查询
  useLazyGetPostsListQuery,
  useLazyGetPostsByIdQuery
} = postsApi;
export default postsApi;
