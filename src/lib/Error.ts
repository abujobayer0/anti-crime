import axios from "axios";

export const handleAPIError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNREFUSED") {
      alert("Unable to connect to AI service. Please try again later.");
    } else if (error.response?.status === 429) {
      alert("Too many requests. Please wait a moment and try again.");
    } else {
      alert(
        `AI service error: ${
          error.response?.data?.message || "Please try again later"
        }`
      );
    }
  } else {
    alert("Failed to generate description. Please try again.");
  }
};
