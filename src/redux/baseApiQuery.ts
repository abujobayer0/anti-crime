import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApiQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000/api", 
});
