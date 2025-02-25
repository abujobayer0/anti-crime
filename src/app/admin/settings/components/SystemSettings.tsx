import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface SystemSettingsProps {
  settings: {
    maintenanceMode: boolean;
    dataRetentionDays: number;
    backupFrequency: string;
    maxReportSize: number;
    enableAnalytics: boolean;
    enableApiAccess: boolean;
  };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSwitchChange: (name: string, checked: boolean) => void;
}

const SystemSettings = ({
  settings,
  onChange,
  onSwitchChange,
}: SystemSettingsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="dataRetentionDays">Data Retention Period (days)</Label>
        <Input
          id="dataRetentionDays"
          name="dataRetentionDays"
          type="number"
          value={settings.dataRetentionDays}
          onChange={onChange}
        />
      </div>
      <div>
        <Label htmlFor="backupFrequency">Backup Frequency</Label>
        <select
          id="backupFrequency"
          name="backupFrequency"
          className="w-full p-2 border rounded-md"
          value={settings.backupFrequency}
          onChange={onChange}
        >
          <option value="hourly">Hourly</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="enableAnalytics">Enable Analytics</Label>
        <Switch
          id="enableAnalytics"
          name="enableAnalytics"
          checked={settings.enableAnalytics}
          onCheckedChange={(checked) =>
            onSwitchChange("enableAnalytics", checked)
          }
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="enableApiAccess">Enable API Access</Label>
        <Switch
          id="enableApiAccess"
          name="enableApiAccess"
          checked={settings.enableApiAccess}
          onCheckedChange={(checked) =>
            onSwitchChange("enableApiAccess", checked)
          }
        />
      </div>
    </div>
  );
};
export default SystemSettings;
