import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import logger from "redux-logger";
import { setupListeners } from "@reduxjs/toolkit/dist/query/react";

import { baseApi } from "./api/base.service";
import { postsSlice } from "./slice/post.slice";
import postsApi from "./api/module/posts.service";
import accountApi from "./api/module/account";

const persistConfig = {
  key: "root",
  storage
};
const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  // 自定义要存储的数据
  posts: postsSlice.reducer
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 中间件集合
const middlewareHandler = (getDefaultMiddleware: any) => {
  const middlewareList = [
    ...getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"]
      }
    }),
    // 如果要使用onQueryStarted及很多功能都要这样引入
    postsApi.middleware,
    accountApi.middleware
  ];
  if (process.env.NODE_ENV === "development") {
    middlewareList.push(logger);
  }
  return middlewareList;
};
// API slice会包含自动生成的redux reducer和一个自定义中间件
export const rootStore = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => middlewareHandler(getDefaultMiddleware)
});

export const persistor = persistStore(rootStore);
export type RootState = ReturnType<typeof rootStore.getState>;

setupListeners(rootStore.dispatch);
