import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
export const ServiceApiSlice = createApi({
  reducerPath: "ServiceApiSlice",
  tagTypes: ["Service"],
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      // تجنب استخدام localStorage مباشرة في SSR
      if (typeof window !== "undefined") {
        const token = Cookies.get("access_token");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getServices: builder.query({
      query: () => "/api/services",
      providesTags: ["Service"],
    }),
  }),
});

export const { useGetServicesQuery } = ServiceApiSlice;
