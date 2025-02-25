import React from "react";
import Image from "next/legacy/image";
import { X, Loader2 } from "lucide-react";
import { useReportFormContext } from "./ReportFormContext";

const ImagePreview = () => {
  const { imagePreview, uploadingImages, removeImage, handleChange } =
    useReportFormContext();

  if (imagePreview.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 rounded-xl overflow-hidden">
      {imagePreview.map((preview, index) => (
        <div key={preview} className="relative group aspect-square">
          <Image
            src={preview}
            alt={`Preview ${index + 1}`}
            unoptimized
            priority
            layout="fill"
            className="w-full h-full object-cover"
          />
          {uploadingImages.has(preview) && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              removeImage(index);
              handleChange(
                "images",
                imagePreview.filter((_, i) => i !== index)
              );
            }}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all hover:bg-black/80"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ImagePreview;
