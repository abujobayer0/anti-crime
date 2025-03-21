import React from "react";
import { MapPin } from "lucide-react";
import { SelectComponent } from "../select-component";
import { SelectItem } from "@/components/ui/select";
import { useReportFormContext } from "./ReportFormContext";

const LocationSelector = () => {
  const {
    formData,
    divisions,
    districts,
    handleDivisionChange,
    handleDistrictChange,
    language,
    setLanguage,
  } = useReportFormContext();

  return (
    <div className="flex flex-wrap gap-2">
      <div className="flex items-center gap-2 bg-muted/20 hover:bg-muted/30 transition-colors px-3 py-2 rounded-full">
        <MapPin className="w-4 h-4 text-primary/70" />
        <SelectComponent
          selectValue="Select Division"
          value={formData.division}
          onValueChange={handleDivisionChange}
          content={
            <>
              {divisions.map((div) => (
                <SelectItem key={div.id} value={div}>
                  {div.name}
                </SelectItem>
              ))}
            </>
          }
        />
      </div>
      <div className="flex items-center gap-2 bg-muted/20 hover:bg-muted/30 transition-colors px-3 py-2 rounded-full">
        <MapPin className="w-4 h-4 text-primary/70" />
        <SelectComponent
          selectValue="Select District"
          value={formData.district.name}
          onValueChange={handleDistrictChange}
          disabled={!formData.division}
          content={
            <>
              {districts.map((dist) => (
                <SelectItem key={dist.id} value={dist}>
                  {dist.name}
                </SelectItem>
              ))}
            </>
          }
        />
      </div>
      <div className="flex items-center gap-2">
        <SelectComponent
          selectValue="Language"
          value={language}
          onValueChange={(value) => setLanguage(value as "EN" | "BN")}
          content={
            <>
              <SelectItem value="EN">English</SelectItem>
              <SelectItem value="BN">Bangla</SelectItem>
            </>
          }
        />
      </div>
    </div>
  );
};

export default LocationSelector;
