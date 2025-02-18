import client from "@/api/client";
import { ENDPOINTS } from "@/api/config";

export const getAllReports = async () => {
  const { data } = await client.get(ENDPOINTS.reports.list);
  return data;
};
export const getRecentReports = async () => {
  const { data } = await client.get(ENDPOINTS.reports.recentReports);
  return data;
};

export const getReportById = async (id: string) => {
  const { data } = await client.get(ENDPOINTS.reports.detail(id));
  return data.data;
};

export const getReportComments = async (reportId: string) => {
  const { data } = await client.get(`${ENDPOINTS.reports.detail(reportId)}`);
  return data.data;
};

export const upvoteReport = async (reportId: string) => {
  const { data } = await client.post(`${ENDPOINTS.reports.upvote(reportId)}`);
  return data;
};

export const downvoteReport = async (reportId: string) => {
  const { data } = await client.post(`${ENDPOINTS.reports.downvote(reportId)}`);
  return data;
};
