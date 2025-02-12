import { baseApi } from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMeDB: builder.query({
      query: (token) => ({
        url: `/users/get-me/${token}`,
        method: "GET",
      }),
      // invalidatesTags: ['users'],
    }),

    // Login mutation
    update: builder.mutation({
      query: (info) => ({
        url: `/users/${info.id}`,
        method: "PATCH",
        body: info.data,
      }),
      invalidatesTags: ["users"],
    }),
  }),
});

// Exporting the hooks to use in components
export const { useUpdateMutation, useGetMeDBQuery } = authApi;
