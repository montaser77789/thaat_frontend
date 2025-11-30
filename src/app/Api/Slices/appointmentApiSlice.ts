import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
export const appointmentApiSlice = createApi({
  reducerPath: "appointmentApiSlice",
  tagTypes: ["appointment"],
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
    editAppointment: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/appointments/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["appointment"],
    }),
    getAppointmentById: builder.query({
      query: (id) => `/api/appointments/${id}`,
      providesTags: ["appointment"],
    })
  }),
});

export const { useEditAppointmentMutation ,useGetAppointmentByIdQuery } = appointmentApiSlice;
