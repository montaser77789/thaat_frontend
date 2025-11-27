import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
export const CityApiSlice = createApi({
  reducerPath: "CityApiSlice",
  tagTypes: ["City"],
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
    getCity: builder.query({
      query: () => "/api/settings/city",
      providesTags: ["City"],
    }),
    createCity: builder.mutation({
      query: (data) => ({
        url: "/api/settings/city",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["City"],
    }),
    updateCity: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/settings/city/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["City"],
    }),
    deleteCity: builder.mutation({
      query: (id) => ({
        url: `/api/settings/city/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["City"],
    }),
    getCityById: builder.query({
      query: (id) => `/api/settings/city/${id}`,
      providesTags: ["City"],
    }),
  }),
});

export const {
  useGetCityQuery,
  useCreateCityMutation,
  useUpdateCityMutation,
  useDeleteCityMutation,
  useGetCityByIdQuery,
} = CityApiSlice;
