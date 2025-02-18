import { useState, useEffect } from "react";
import { uploadFileToImageBB } from "@/lib/utils";

export const useImageUpload = () => {
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    return () => {
      imagePreview.forEach(URL.revokeObjectURL);
    };
  }, [imagePreview]);

  const handleImageUpload = async (files: File[]) => {
    if (!files.length) return [];

    const newPreviews = files.map(URL.createObjectURL);
    setUploadingImages(new Set(newPreviews));
    setImagePreview([...imagePreview, ...newPreviews]);

    try {
      const uploadedUrls = await Promise.all(files.map(uploadFileToImageBB));
      return uploadedUrls;
    } catch (error) {
      console.error("Error uploading images:", error);
      setImagePreview(
        imagePreview.slice(0, imagePreview.length - files.length)
      );
      return [];
    } finally {
      setUploadingImages(new Set());
    }
  };

  const removeImage = (index: number) => {
    setImagePreview(imagePreview.filter((_, i) => i !== index));
  };

  return {
    imagePreview,
    uploadingImages,
    handleImageUpload,
    removeImage,
  };
};
