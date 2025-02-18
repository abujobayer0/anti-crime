"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import Base64 from "base64-js";

const fetchWithTimeout = async (
  url: string,
  options: RequestInit,
  timeout: number
): Promise<Response> => {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error: any) {
    throw new Error(`Failed to fetch image: ${error.message}`);
  }
};

const generateDescription = async (images: string[], prompt: string) => {
  try {
    const imagePromises = images.map(async (imageURL) => {
      try {
        const res = await fetchWithTimeout(imageURL, {}, 15000);
        const arrayBuffer = await res.arrayBuffer();
        return Base64.fromByteArray(new Uint8Array(arrayBuffer));
      } catch (error: any) {
        console.error(`Error processing image ${imageURL}:`, error);
        throw new Error(`Failed to process image: ${error.message}`);
      }
    });

    const imageBase64Array = await Promise.all(imagePromises);

    const contents = [
      {
        role: "user",
        parts: [
          ...imageBase64Array.map((base64) => ({
            inline_data: { mime_type: "image/jpeg", data: base64 },
          })),
          { text: prompt },
        ],
      },
    ];

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // @ts-expect-error - Gemini API types are not yet available
    const result = await model.generateContentStream({ contents });

    let responseString = "";

    for await (const res of result.stream) {
      responseString += res.text();
    }

    return responseString;
  } catch (error) {
    console.error("Error in generateDescription:", error);
    throw error;
  }
};

export default generateDescription;
