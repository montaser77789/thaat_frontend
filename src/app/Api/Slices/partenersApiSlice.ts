import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
export const partenersApiSlice = createApi({
  reducerPath: "partenersApiSlice",
  tagTypes: ["parteners"],
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
    getParteners: builder.query<
      any,
      { page: number; limit: number; search?: string; status?: string }
    >({
      query: ({ page, limit, search, status }) => ({
        url: "/api/parteners",
        params: { page, limit, search, status },
      }),

      providesTags: ["parteners"],
    }),
    createPartener: builder.mutation({
      query: (data) => ({
        url: "/api/parteners",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["parteners"],
    }),
    deletePartner: builder.mutation({
      query: (id) => ({
        url: `/api/parteners/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["parteners"],
    }),
    getPartenerById: builder.query({
      query: (id) => `/api/parteners/${id}`,
      providesTags: ["parteners"],
    }),
    updatePartener: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/parteners/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["parteners"],
    }),
  }),
});

export const {
  useGetPartenersQuery,
  useCreatePartenerMutation,
  useDeletePartnerMutation,
  useGetPartenerByIdQuery,
  useUpdatePartenerMutation,
} = partenersApiSlice;
