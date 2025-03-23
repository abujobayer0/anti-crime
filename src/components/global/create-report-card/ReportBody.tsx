import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { useReportFormContext } from "./ReportFormContext";
import LocationSelector from "./LocationSelector";
import ImagePreview from "./ImagePreview";

const ReportBody = () => {
  const { formData, handleChange } = useReportFormContext();

  return (
    <div className="p-5 space-y-2">
      <Textarea
        placeholder="Describe the crime incident in detail..."
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        className="min-h-[20px] bg-transparent border-none focus-visible:ring-0 text-[15px] placeholder:text-muted-foreground/60"
      />
      <LocationSelector />
      <ImagePreview />
    </div>
  );
};

export default ReportBody;
