import { createSlice } from "@reduxjs/toolkit";
import { IPostVo } from "../api/module/posts.service";

interface PostsState {
  /** 后端数据返回的 */
  postList: IPostVo[];
}

const initialState: PostsState = {
  postList: []
};

export const postsSlice = createSlice({
  name: "Posts",
  initialState,
  reducers: {
    clearPosts: (state: PostsState) => {
      state.postList = [];
    },
    setPosts: (state: PostsState, action) => {
      state.postList = action.payload;
    }
  },
  extraReducers: {}
});
