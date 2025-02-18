import generateDescription from "@/hooks/api/generateDescription";
import { handleAPIError } from "./Error";
import { cleanUpResponse } from "./utils";

export const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} days ago`;
  if (hours > 0) return `${hours} hours ago`;
  if (minutes === 0) return "just now";
  return `${minutes} minutes ago`;
};

export const generateReport = async (
  images: string[],
  division: string,
  district: string,
  language: "EN" | "BN"
) => {
  const data = await generateDescription(
    images?.[0] || "",
    `write a description for crime report platform post describing the given image.
    Division: ${division}
    District: ${district}
    give me a json format {title:<title based on the description> description:<description based on the image>} ${
      language === "BN" ? "in bangla" : ""
    }
    `
  ).catch((err) => {
    handleAPIError(err);
  });

  const cleanedData = cleanUpResponse(data || "");
  return cleanedData;
};
