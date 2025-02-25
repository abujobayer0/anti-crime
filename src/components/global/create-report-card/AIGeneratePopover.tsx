import React, { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useReportFormContext } from "./ReportFormContext";

const AIGeneratePopover = () => {
  const [open, setOpen] = useState(false);
  const {
    formData,
    isSubmitting,
    isAutoMode,
    setIsAutoMode,
    language,
    customPrompt,
    setCustomPrompt,
    handleAIAutoGeneration,
    handleAICustomGeneration,
  } = useReportFormContext();

  const isDisabled =
    !formData.images?.length || !formData.division || !formData.district;

  const handleGenerate = async () => {
    if (isAutoMode) {
      await handleAIAutoGeneration();
    } else {
      await handleAICustomGeneration();
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className={`relative group overflow-hidden transition-all duration-300 ${
            isDisabled ? "text-muted-foreground" : "text-primary"
          } hover:bg-accent hover:text-accent-foreground hover:scale-105 hover:shadow-lg data-[state=open]:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:scale-105 data-[state=open]:shadow-lg`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Sparkles className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100">
                <div className="absolute inset-0 animate-sparkle-slow bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="absolute inset-0 animate-sparkle-fast bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>
            </>
          )}
          AI Generate
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 backdrop-blur-sm bg-background/95 border border-border/40 shadow-lg">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              AI Report Generation
            </h3>
            <Switch
              checked={isAutoMode}
              onCheckedChange={setIsAutoMode}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            {[
              {
                value: formData.images?.length,
                label: "images uploaded",
                required: true,
              },
              { value: formData.division, label: "division", required: true },
              { value: formData.district, label: "district", required: true },
              { value: language, label: "language", required: true },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    item.value ? "bg-primary" : "bg-muted"
                  }`}
                />
                {item.value
                  ? `${item.value} ${item.label}`
                  : `Select ${item.label}`}
              </div>
            ))}
          </div>

          {!isAutoMode && (
            <Textarea
              placeholder="Enter custom prompt for AI generation..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="h-24 resize-none"
              disabled={isSubmitting}
            />
          )}

          <Button
            onClick={handleGenerate}
            disabled={
              isSubmitting || (!isAutoMode && !customPrompt) || isDisabled
            }
            className="w-full"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {isSubmitting ? "Generating..." : "Generate Report"}
          </Button>

          {isDisabled ? (
            <p className="text-xs text-yellow-600 dark:text-yellow-400">
              Complete all required fields to generate the report
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              AI will analyze images and location data
              {!isAutoMode && " using your custom prompt"}
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AIGeneratePopover;
