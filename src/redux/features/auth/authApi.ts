import { baseApi } from '../../api/baseApi';

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login mutation
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['users', 'posts'],
    }),

    // Register mutation
    register: builder.mutation({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['users', 'posts'],
    }),
    getMe: builder.query({
      query: () => ({
        url: '/profile',
        method: 'GET',
      }),
      providesTags: ['users', 'posts'],
    }),
    resetLink: builder.mutation({
      query: (credentials) => {
        return {
          url: '/auth/reset-link',
          method: 'POST',
          body: credentials,
        };
      },
      invalidatesTags: ['users', 'posts'],
    }),
    forgetPassword: builder.mutation({
      query: (credentials) => ({
        url: '/auth/forget-password',
        method: 'POST',
        body: credentials,
        headers: {
          Authorization: `${credentials.token}`,
        },
      }),
      invalidatesTags: ['users', 'posts'],
    }),
    changePassword: builder.mutation({
      query: (credentials) => ({
        url: '/auth/change-password',
        method: 'POST',
        body: credentials,
        headers: {
          Authorization: `${credentials.token}`,
        },
      }),
      invalidatesTags: ['users', 'posts'],
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
