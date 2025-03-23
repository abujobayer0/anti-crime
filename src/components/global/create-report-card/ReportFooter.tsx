import React from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, VideoIcon } from "lucide-react";
import { useReportFormContext } from "./ReportFormContext";
import AIGeneratePopover from "./AIGeneratePopover";

const ReportFooter = () => {
  const { formData, handleSubmit, handleImageChange } = useReportFormContext();

  return (
    <div className="flex items-center justify-between pt- border-t border-border/10 p-5">
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:bg-muted/30 rounded-xl"
          onClick={() => document.getElementById("image-input")?.click()}
        >
          <ImagePlus className="w-5 h-5 mr-2" />
          Photos
        </Button>
        <input
          id="image-input"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageChange}
        />
        <Button
          variant="ghost"
          size="sm"
          disabled
          className="text-muted-foreground hover:bg-muted/30 rounded-xl"
        >
          <VideoIcon className="w-5 h-5 mr-2" />
          Video
        </Button>
        <AIGeneratePopover />
      </div>

      <Button
        onClick={(e) => handleSubmit(e)}
        className="bg-primary hover:bg-primary/90 px-6"
        disabled={
          !formData.description || !formData.images?.length || !formData.userId
        }
      >
        Post
      </Button>
    </div>
  );
};

export default ReportFooter;
