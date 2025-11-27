import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const AuthApiSlice = createApi({
  reducerPath: "AuthApiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_PUBLIC_API_URL,
    
  }),
  
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/api/settings/users/login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});
export const { useLoginMutation } = AuthApiSlice;
