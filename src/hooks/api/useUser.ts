import { useQuery } from "@tanstack/react-query";
import apiClient from "@/api/client";

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await apiClient.get(`/users/get-me`);
      return data.data;
    },
    retry: false,
  });
};
