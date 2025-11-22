import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
export const specialistApiSlice = createApi({
  reducerPath: "specialistApiSlice",
  tagTypes: ["specialist"],
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
    addSpecialist: builder.mutation({
      query: (data) => ({
        url: "/api/specialists",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["specialist"],
    }),
    updateSpecialist: builder.mutation({
      query: ({ data , id}) => ({
        url: `/api/specialists/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["specialist"],
    }),
    getSpecialistsById: builder.query({
      query: (id) => `/api/specialists/${id}`,
      providesTags: ["specialist"],
    }),
    getSpecialists: builder.query<
      any,
      { page: number; limit: number; search?: string; partner_id?: string , medical_branch_id?: string}
    >({
      query: ({ page, limit, search, partner_id , medical_branch_id }) => ({
        url: "/api/specialists",
        params: { page, limit, search, partner_id , medical_branch_id  },
      }),
      providesTags: ["specialist"],
    }),
    deleteSpecialist: builder.mutation({
      query: (id) => ({
        url: `/api/specialists/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["specialist"],
    }),
  }),
});

export const {
  useAddSpecialistMutation,
  useUpdateSpecialistMutation,
  useGetSpecialistsByIdQuery,
  useGetSpecialistsQuery,
  useDeleteSpecialistMutation,
} = specialistApiSlice;
