import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
export const AdminApiSlice = createApi({
  reducerPath: "adminApiSlice",
  tagTypes: ["admin"],
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
    getadmin: builder.query({
      query: () => "/api/settings/users",
      providesTags: ["admin"],
    }),
    createadmin: builder.mutation({
      query: (data) => ({
        url: "/api/settings/users/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["admin"],
    }),
    updateadmin: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/settings/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["admin"],
    }),
    deleteadmin: builder.mutation({
      query: (id) => ({
        url: `/api/settings/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["admin"],
    }),
    getadminById: builder.query({
      query: (id) => `/api/settings/users/${id}`,
      providesTags: ["admin"],
    }),
  }),
});

export const {
  useGetadminQuery,
  useCreateadminMutation,
  useUpdateadminMutation,
  useDeleteadminMutation,
  useGetadminByIdQuery,
} = AdminApiSlice;
