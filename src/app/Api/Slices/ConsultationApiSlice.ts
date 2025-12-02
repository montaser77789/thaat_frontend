import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
export const ConsultationApiSlice = createApi({
  reducerPath: "ConsultationApiSlice",
  tagTypes: ["Consultation"],
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
    createConsultationRequest: builder.mutation({
      query: (data) => ({
        url: "/api/consultation-requests",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Consultation"],
    }),
    getConsultationRequests: builder.query<
      any,
      { page: number; limit: number; search?: string }
    >({
      query: ({ page, limit, search }) => ({
        url: "/api/consultation-requests",
        params: { page, limit, search },
      }),
      providesTags: ["Consultation"],
    }),
    getConsultationRequestById: builder.query({
      query: (id) => `/api/consultation-requests/${id}`,
      providesTags: ["Consultation"],
    }),
    sendWhatsappMessage: builder.mutation({
      query: ({ id, type }) => ({
        url: `/api/consultation-requests/${id}/send-template`,
        method: "PATCH",
        body: { type },
      }),
    }),
  }),
});

export const {
  useCreateConsultationRequestMutation,
  useGetConsultationRequestsQuery,
  useGetConsultationRequestByIdQuery,
  useSendWhatsappMessageMutation,
} = ConsultationApiSlice;
