export const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_SERVER_URL_DEVELOPMENT
    : process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_SERVER_URL_PRODUCTION
    : "";

export const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
};

export const ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    reset: "/auth/reset-link",
    forgetPassword: "/auth/forgot-password",
    changePassword: "/auth/change-password",
  },
  reports: {
    list: "/reports",
    getAlgorithmicReports: "/reports/algorithmic-reports",
    getUserReports: "/reports/user-reports",
    getProfileReports: (userId: string) => `/reports/profile-reports/${userId}`,
    detail: (id: string) => `/reports/${id}`,
    create: "/reports",
    update: (id: string) => `/reports/${id}`,
    delete: (id: string) => `/reports/${id}`,
    generateAiDescription: "/reports/analyze",
    upvote: (id: string) => `/reports/${id}/upvote`,
    downvote: (id: string) => `/reports/${id}/downvote`,
    recentReports: "/reports/recent-reports",
  },
  notifications: {
    list: "/notifications",
    read: (id: string) => `/notifications/read/${id}`,
    markAllAsRead: "/notifications/mark-all-read",
    remove: (id: string) => `/notifications/${id}`,
  },
  followers: {
    list: "/followers",
    follow: (userId: string) => `/followers/follow/${userId}`,
    unfollow: (userId: string) => `/followers/unfollow/${userId}`,
    checkFollowStatus: (userId: string) =>
      `/followers/check-follow-status/${userId}`,
  },
  comments: {
    create: (reportId: string) => `/comments/${reportId}/comment`,
    update: (id: string) => `/comments/${id}/update`,
    delete: (id: string) => `/comments/${id}/delete`,
  },
  users: {
    getUser: "/users/get-me",
    getAllUsers: "/users",
    getBannedUsers: "/users/get-banned-users",
    updateUser: (userId: string) => `/users/${userId}`,
    getUserProfile: (userId: string) => `/users/${userId}`,
  },
  search: {
    search: `/reports/query`,
  },
};
