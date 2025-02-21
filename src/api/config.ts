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
  },
  reports: {
    list: "/reports",
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
  comments: {
    create: (reportId: string) => `/comments/${reportId}/comment`,
  },
  users: {
    getUser: "/users/get-me",
    getUserProfile: (userId: string) => `/users/${userId}`,
  },
};
