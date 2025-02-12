import { createApi } from "@reduxjs/toolkit/query/react";
import { baseApiQuery } from "../baseApiQuery";

export const crimeApi = createApi({
  reducerPath: "crimeApi",
  baseQuery: baseApiQuery,
  endpoints: (builder) => ({
    postCrime: builder.mutation({
      query: (data) => ({
        url: "/post-crime",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { usePostCrimeMutation } = crimeApi;
