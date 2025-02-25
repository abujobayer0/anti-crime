import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ReportSettingsProps {
  settings: {
    enableAnonymousReporting: boolean;
    requireLocationData: boolean;
    allowMediaUploads: boolean;
    maxMediaSize: number;
    autoArchiveDays: number;
    categoriesEnabled: boolean;
  };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSwitchChange: (name: string, checked: boolean) => void;
}

const ReportSettings = ({
  settings,
  onChange,
  onSwitchChange,
}: ReportSettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="enableAnonymousReporting">
          Allow Anonymous Reports
        </Label>
        <Switch
          id="enableAnonymousReporting"
          name="enableAnonymousReporting"
          checked={settings.enableAnonymousReporting}
          onCheckedChange={(checked) =>
            onSwitchChange("enableAnonymousReporting", checked)
          }
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="requireLocationData">Require Location Data</Label>
        <Switch
          id="requireLocationData"
          name="requireLocationData"
          checked={settings.requireLocationData}
          onCheckedChange={(checked) =>
            onSwitchChange("requireLocationData", checked)
          }
        />
      </div>
      <div>
        <Label htmlFor="maxMediaSize">Maximum Media Size (MB)</Label>
        <Input
          id="maxMediaSize"
          name="maxMediaSize"
          type="number"
          value={settings.maxMediaSize}
          onChange={onChange}
        />
      </div>
      <div>
        <Label htmlFor="autoArchiveDays">Auto-Archive After (days)</Label>
        <Input
          id="autoArchiveDays"
          name="autoArchiveDays"
          type="number"
          value={settings.autoArchiveDays}
          onChange={onChange}
        />
      </div>
    </div>
  );
};
export default ReportSettings;
