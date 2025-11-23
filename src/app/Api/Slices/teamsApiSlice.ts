import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
export const TeamApiSlice = createApi({
  reducerPath: "TeamApiSlice",
  tagTypes: ["Team"],
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
    createTeam: builder.mutation({
      query: (data) => ({
        url: "/api/teams",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Team"],
    }),
    updateTeam: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/teams/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Team"],
    }),
    getTeams: builder.query<
      any,
      {
        page: number;
        limit: number;
        search?: string;
        partner_id?: string;
        medical_branch_id?: string;
        city_id?: string;
        status?: string;
      }
    >({
      query: ({
        page,
        limit,
        search,
        city_id,
        partner_id,
        medical_branch_id,
        status,
      }) => ({
        url: "/api/teams",
        params: {
          page,
          limit,
          search,
          city_id,
          partner_id,
          medical_branch_id,
          status,
        },
      }),
      providesTags: ["Team"],
    }),
    getTeamById: builder.query({
      query: (id) => `/api/teams/${id}`,
      providesTags: ["Team"],
    }),
    deleteTeam: builder.mutation({
      query: (id) => ({
        url: `/api/teams/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Team"],
    }),
  }),
});

export const {
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useGetTeamByIdQuery,
  useGetTeamsQuery,
  useDeleteTeamMutation,
} = TeamApiSlice;
