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
      query: () => "/api/settings/services",
      providesTags: ["Service"],
    }),
    getServiceById: builder.query({
      query: (id) => `/api/settings/services/${id}`,
      providesTags: ["Service"],
    }),
    createService: builder.mutation({
      query: (data) => ({
        url: "/api/settings/services",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Service"],
    }),
    updateService: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/settings/services/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Service"],
    }),
    deleteService: builder.mutation({
      query: (id) => ({
        url: `/api/settings/services/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Service"],
    }),
    getServicesByCatagory: builder.query({
      query: ({ catagory_id, city_id }) =>
        `/api/settings/services/catagory/${catagory_id}/city/${city_id}`,
      providesTags: ["Service"],
    }),
  }),
});

export const {
  useGetServicesQuery,
  useGetServiceByIdQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useGetServicesByCatagoryQuery,
} = ServiceApiSlice;
