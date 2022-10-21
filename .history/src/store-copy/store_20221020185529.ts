import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch as useAppDispatch } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "@/store/api/base";
import testSlice from "./slice/post";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage
};

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  testSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 中间件集合
const middlewareHandler = (getDefaultMiddleware: any) => {
  // const middlewareList = [...getDefaultMiddleware(), baseApi.middleware];
  const middlewareList = [...getDefaultMiddleware()];
  return middlewareList;
};

export const rootStore = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => middlewareHandler(getDefaultMiddleware)
});

// export type RootState = ReturnType<typeof rootStore.getState>;
// export type Dispatch = typeof rootStore.dispatch;
// export const useDispatch = () => useAppDispatch<Dispatch>();

export const persistor = persistStore(rootStore);

export type RootState = ReturnType<typeof rootStore.getState>;

setupListeners(rootStore.dispatch);
