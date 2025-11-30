import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
export const catagoryApiSlice = createApi({
  reducerPath: "catagoryApiSlice",
  tagTypes: ["catagory"],
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
    createCatagory: builder.mutation({
      query: (data) => ({
        url: "/api/catagories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["catagory"],
    }),
    updateCatagory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/catagories/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["catagory"],
    }),
    getCatagoryById: builder.query({
      query: (id) => `/api/catagories/${id}`,
      providesTags: ["catagory"],
    }),
    getAllCatagory: builder.query<
      any,
      {
        page: number;
        limit: number;
        search?: string;
      }
    >({
      query: ({ page, limit, search }) => ({
        url: "/api/catagories",
        params: { page, limit, search },
      }),

      providesTags: ["catagory"],
    }),
    deleteCatagory: builder.mutation({
      query: (id) => ({
        url: `/api/catagories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["catagory"],
    }),
    getCatagores: builder.query({
      query: () => "/api/catagories/all",
    })
  }),
});

export const {
  useCreateCatagoryMutation,
  useUpdateCatagoryMutation,
  useGetCatagoryByIdQuery,
  useGetAllCatagoryQuery,
  useDeleteCatagoryMutation,
  useGetCatagoresQuery
} = catagoryApiSlice;
