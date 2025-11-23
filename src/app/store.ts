import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { CityApiSlice } from "./Api/Slices/CityApiSlice";
import { AuthApiSlice } from "./Api/Slices/AuthApiSlice";
import { ServiceApiSlice } from "./Api/Slices/ServiceApiSlice";
import { ConsultationApiSlice } from "./Api/Slices/ConsultationApiSlice";
import { CountryApiSlice } from "./Api/Slices/CountryApiSlice";
import { partenersApiSlice } from "./Api/Slices/partenersApiSlice";
import { BranchesApiSlice } from "./Api/Slices/BranchesApiSlice";
import { specialistApiSlice } from "./Api/Slices/specialistApiSlice";
import { TeamApiSlice } from "./Api/Slices/teamsApiSlice";

export const store = configureStore({
  reducer: {
    [CityApiSlice.reducerPath]: CityApiSlice.reducer,
    [AuthApiSlice.reducerPath]: AuthApiSlice.reducer,
    [ServiceApiSlice.reducerPath]: ServiceApiSlice.reducer,
    [ConsultationApiSlice.reducerPath]: ConsultationApiSlice.reducer,
    [CountryApiSlice.reducerPath]: CountryApiSlice.reducer,
    [partenersApiSlice.reducerPath]: partenersApiSlice.reducer,
    [BranchesApiSlice.reducerPath]: BranchesApiSlice.reducer,
    [specialistApiSlice.reducerPath]: specialistApiSlice.reducer,
    [TeamApiSlice.reducerPath]: TeamApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      CityApiSlice.middleware,
      AuthApiSlice.middleware,
      ServiceApiSlice.middleware,
      ConsultationApiSlice.middleware,
      CountryApiSlice.middleware,
      partenersApiSlice.middleware,
      BranchesApiSlice.middleware,
      specialistApiSlice.middleware,
      TeamApiSlice.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
