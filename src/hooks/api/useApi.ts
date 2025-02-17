import { useCallback } from "react";

import { useToast } from "../ui/useToast";
import apiClient from "@/api/client";

export const useApi = () => {
  const { showToast } = useToast();

  const handleError = useCallback(
    (error: any) => {
      const message = error.response?.data?.message || "An error occurred";
      showToast({ type: "error", message });
    },
    [showToast]
  );

  const handleSuccess = useCallback(
    (message: string) => {
      showToast({ type: "success", message });
    },
    [showToast]
  );

  return {
    client: apiClient,
    handleError,
    handleSuccess,
  };
};
