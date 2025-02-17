import { useQuery } from "@tanstack/react-query";
import apiClient from "@/api/client";

export const useUser = (reports: { reports: boolean }) => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/auth/me?reports=${reports.reports}`
      );
      return data.data;
    },
    retry: false,
  });
};
