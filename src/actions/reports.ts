"use client";
import client from "@/api/client";
import { ENDPOINTS } from "@/api/config";
import { Report } from "@/types";

type AsyncFunction<T extends unknown[], R> = (...args: T) => Promise<R>;

const ErrorHandler = <T extends unknown[], R>(
  func: AsyncFunction<T, R>
): AsyncFunction<T, R> => {
  return (async (...args: T): Promise<R> => {
    try {
      return await func(...args);
    } catch (error) {
      console.error("Error in action:", error);
      throw error;
    }
  }) as AsyncFunction<T, R>;
};

export const getAllReports = ErrorHandler<[], Report[]>(async () => {
  const { data } = await client.get<Report[]>(ENDPOINTS.reports.list);
  return data;
});

export const getRecentReports = ErrorHandler<[], Report[]>(async () => {
  const { data } = await client.get<Report[]>(ENDPOINTS.reports.recentReports);
  return data;
});

export const getReportById = ErrorHandler<[string], Report>(async (id) => {
  const { data } = await client.get<{ data: Report }>(
    ENDPOINTS.reports.detail(id)
  );
  return data.data;
});

export const getReportComments = ErrorHandler<[string], Report>(
  async (reportId) => {
    const { data } = await client.get<{ data: Report }>(
      ENDPOINTS.reports.detail(reportId)
    );
    return data.data;
  }
);
