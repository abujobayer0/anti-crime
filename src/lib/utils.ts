import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const uploadFileToImageBB = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGE_BB_API_KEY}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error?.message || "Failed to upload image");
    }

    return data.data.url;
  } catch (err) {
    console.error("Error uploading file:", err);
    throw new Error("Error uploading file to ImageBB.");
  }
};
export const cleanUpResponse = (response: string) => {
  try {
    const matched = response.match(/{[\s\S]*}/);

    if (matched && matched[0]) {
      const jsonString = matched[0].trim();

      if (jsonString.startsWith("{") && jsonString.endsWith("}")) {
        return JSON.parse(jsonString);
      }
    }
  } catch (err) {
    console.error("Error parsing response as JSON:", err);
  }

  return null;
};
