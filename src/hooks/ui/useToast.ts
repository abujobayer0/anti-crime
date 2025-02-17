import { useCallback } from "react";
import { toast } from "sonner";

interface ToastOptions {
  type: "success" | "error" | "info" | "warning";
  message: string;
}

export const useToast = () => {
  const showToast = useCallback(({ type, message }: ToastOptions) => {
    toast[type](message);
  }, []);

  return { showToast };
};
