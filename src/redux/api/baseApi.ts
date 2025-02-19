import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { RootState } from "../store";

// const development = process.env.NEXT_PUBLIC_WORKSPACE;
// const localUrl = process.env.NEXT_PUBLIC_BASE_API;
// const liveUrl = process.env.NEXT_PUBLIC_LIVE_API;
export const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_SERVER_URL_DEVELOPMENT
    : process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_SERVER_URL_PRODUCTION
    : "";
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;

    if (token) {
      headers.set("authorization", `${token}`);
    }

    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQuery,
  tagTypes: ["reports", "users", "user", "comments", "upvotes", "downvotes"],
  endpoints: () => ({}),
});
