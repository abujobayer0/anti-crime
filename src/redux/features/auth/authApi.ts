import { baseApi } from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login mutation
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["users", "reports"],
    }),

    // Register mutation
    register: builder.mutation({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["users", "reports"],
    }),
    getMe: builder.query({
      query: () => ({
        url: "/profile",
        method: "GET",
      }),
      providesTags: ["users", "reports"],
    }),
    resetLink: builder.mutation({
      query: (credentials) => {
        return {
          url: "/auth/reset-link",
          method: "POST",
          body: credentials,
        };
      },
      invalidatesTags: ["users", "reports"],
    }),
    forgetPassword: builder.mutation({
      query: (credentials) => ({
        url: "/auth/forget-password",
        method: "POST",
        body: credentials,
        headers: {
          Authorization: `${credentials.token}`,
        },
      }),
      invalidatesTags: ["users", "reports"],
    }),
    changePassword: builder.mutation({
      query: (credentials) => ({
        url: "/auth/change-password",
        method: "POST",
        body: credentials,
        headers: {
          Authorization: `${credentials.token}`,
        },
      }),
      invalidatesTags: ["users", "reports"],
    }),
  }),
});

// Exporting the hooks to use in components
export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useResetLinkMutation,
  useForgetPasswordMutation,
  useChangePasswordMutation,
} = authApi;
