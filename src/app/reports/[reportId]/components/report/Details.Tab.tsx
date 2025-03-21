import { CrimeReport } from "@/components/global/crime-report-card/types";
import { DescriptionWithHashtags } from "@/lib/helpers";
import { Eye, FileText } from "lucide-react";
import Image from "next/image";
import React from "react";

const DetailsTab = ({
  report,
  activeImageIndex,
  setActiveImageIndex,
}: {
  report: CrimeReport;
  activeImageIndex: number;
  setActiveImageIndex: (index: number) => void;
}) => {
  return (
    <>
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 pb-3 border-b">
          <FileText className="w-5 h-5 text-primary" />
          Description
        </h3>
        <div className="prose prose-gray max-w-none">
          <DescriptionWithHashtags text={report?.description} />
        </div>
      </div>

      {report?.images?.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 pb-3 border-b flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            Evidence Images
          </h3>

          <div className="relative aspect-video rounded-xl overflow-hidden mb-4 group">
            <Image
              src={report?.images[activeImageIndex] || ""}
              alt={`Evidence ${activeImageIndex + 1}`}
              layout="fill"
              objectFit="cover"
              className="transition-all duration-500 group-hover:scale-105"
              priority
            />
            <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-md">
              {activeImageIndex + 1}/{report?.images?.length}
            </div>
          </div>

          {report?.images?.length > 1 && (
            <div className="grid grid-cols-6 gap-2">
              {report?.images?.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden transition-all ${
                    activeImageIndex === index
                      ? "ring-2 ring-primary scale-105 z-10"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={image || ""}
                    alt={`Thumbnail ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DetailsTab;
