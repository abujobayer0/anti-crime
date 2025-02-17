// Base configuration for API calls
export const API_BASE_URL = "http://localhost:5001/api/v1";

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
    detail: (id: string) => `/reports/${id}`,
    create: "/reports",
    update: (id: string) => `/reports/${id}`,
    delete: (id: string) => `/reports/${id}`,
    generateAiDescription: "/reports/analyze",
  },
};
