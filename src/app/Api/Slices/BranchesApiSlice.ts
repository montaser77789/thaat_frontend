import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
export const BranchesApiSlice = createApi({
  reducerPath: "BranchesApiSlice",
  tagTypes: ["Branches"],
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
    getBranches: builder.query<
      any,
      {
        page: number;
        per_page: number;
        limit: number;
        search?: string;
        status?: string;
        partner_id?: string;
      }
    >({
      query: ({ page, per_page, limit, search, status, partner_id }) => ({
        url: "/api/medicalbranch",
        params: { page, per_page, limit, search, status, partner_id },
      }),

      providesTags: ["Branches"],
    }),
    createBranch: builder.mutation({
      query: (data) => ({
        url: "/api/medicalbranch",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Branches"],
    }),
    deleteBranch: builder.mutation({
      query: (id) => ({
        url: `/api/medicalbranch/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Branches"],
    }),
    getBranchById: builder.query({
      query: (id) => `/api/medicalbranch/${id}`,
      providesTags: ["Branches"],
    }),
    updateBranch: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/medicalbranch/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Branches"],
    }),
    gerBranchByPartner: builder.query({
      query: (id) => `/api/medicalbranch/partner/${id}`,
      providesTags: ["Branches"],
    })
  }),
});

export const {
  useGetBranchesQuery,
  useCreateBranchMutation,
  useDeleteBranchMutation,
  useGetBranchByIdQuery,
  useUpdateBranchMutation,
  useGerBranchByPartnerQuery
} = BranchesApiSlice;
