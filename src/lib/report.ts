import generateDescription from "@/hooks/api/generateDescription";
import { handleAPIError } from "./Error";
import { cleanUpResponse } from "./utils";
import { CrimeTypes } from "./crimeTypes";

export const formatTimeAgo = (
  date: Date,
  options: { details?: boolean } = {}
) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} d`;
  if (hours > 0) return `${hours} h`;
  if (minutes === 0) return "just now";
  return `${minutes} m`;
};

export const generateReport = async (
  images: string[],
  division: string,
  district: string,
  language: "EN" | "BN",
  customPrompt?: string
) => {
  const data = await generateDescription(
    images,
    `${
      customPrompt
        ? customPrompt
        : `write a description for crime report platform post describing the given images or image. Division: ${division} District: ${district}`
    }
    give me a json format {title:<title based on the description> description:<description based on the image> crimeType: <crimeType based on details ensure crime type is match any of this which is most relevant based on details ${CrimeTypes} if totally not match then make a new crimeType based on Data>} ${
      language === "BN" ? "in bangla" : ""
    }
      give me clean json not any extra text give me only one json`
  ).catch((err) => {
    handleAPIError(err);
  });

  const cleanedData = cleanUpResponse(data || "");
  return cleanedData;
};
