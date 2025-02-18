"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import Base64 from "base64-js";
const fetchWithTimeout = (
  url: string,
  options: RequestInit,
  timeout: number
) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), timeout)
    ),
  ]);
};
const generateDescription = async (imageURL: string, prompt: string) => {
  const imageBase64 = await fetchWithTimeout(imageURL, {}, 30000)
    .then((res: any) => res.arrayBuffer())
    .then((arrayBuffer) => Base64.fromByteArray(new Uint8Array(arrayBuffer)));

  const contents = [
    {
      role: "user",
      parts: [
        {
          inline_data: { mime_type: "image/jpeg", data: imageBase64 },
        },
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
};

export default generateDescription;
