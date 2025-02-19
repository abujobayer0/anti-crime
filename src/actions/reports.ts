"use client";
import client from "@/api/client";
import { ENDPOINTS } from "@/api/config";
import { Report } from "@/types";

const ErrorHandler = (func: any) => {
  return async (...args: any[]) => {
    try {
      return await func(...args);
    } catch (error) {
      console.error("Error in action:", error);
      throw error;
    }
  };
};

export const getAllReports = ErrorHandler(async (): Promise<Report[]> => {
  const { data } = await client.get(ENDPOINTS.reports.list);
  return data;
});

export const getRecentReports = ErrorHandler(async (): Promise<Report[]> => {
  const { data } = await client.get(ENDPOINTS.reports.recentReports);
  return data;
});

export const getReportById = ErrorHandler(async (id: string) => {
  const { data } = await client.get(ENDPOINTS.reports.detail(id));
  return data.data;
});

export const getReportComments = ErrorHandler(async (reportId: string) => {
  const { data } = await client.get(`${ENDPOINTS.reports.detail(reportId)}`);
  return data.data;
});
