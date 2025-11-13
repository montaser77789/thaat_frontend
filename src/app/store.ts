import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { CityApiSlice } from "./Api/Slices/CityApiSlice";
import { AuthApiSlice } from "./Api/Slices/AuthApiSlice";
import { ServiceApiSlice } from "./Api/Slices/ServiceApiSlice";

export const store = configureStore({
  reducer: {
    [CityApiSlice.reducerPath]: CityApiSlice.reducer,
    [AuthApiSlice.reducerPath]: AuthApiSlice.reducer,
    [ServiceApiSlice.reducerPath]: ServiceApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      CityApiSlice.middleware,
      AuthApiSlice.middleware,
      ServiceApiSlice.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
