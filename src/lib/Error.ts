import axios from "axios";
import { toast } from "sonner";

export const handleAPIError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNREFUSED") {
      toast.error("Unable to connect to AI service. Please try again later.");
    } else if (error.response?.status === 429) {
      toast.error("Too many requests. Please wait a moment and try again.");
    } else {
      toast.error(
        `AI service error: ${
          error.response?.data?.message || "Please try again later"
        }`
      );
    }
  } else {
    toast.error("Failed to generate description. Please try again.");
  }
};
