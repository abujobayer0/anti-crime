import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface NotificationSettingsProps {
  settings: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    emergencyAlerts: boolean;
    dailyReportDigest: boolean;
    statusUpdateAlerts: boolean;
  };
  onChange: (setting: string) => void;
}

const NotificationSettings = ({
  settings,
  onChange,
}: NotificationSettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="emailNotifications">Email Notifications</Label>
        <Switch
          id="emailNotifications"
          checked={settings.emailNotifications}
          onCheckedChange={() => onChange("emailNotifications")}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="pushNotifications">Push Notifications</Label>
        <Switch
          id="pushNotifications"
          checked={settings.pushNotifications}
          onCheckedChange={() => onChange("pushNotifications")}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="emergencyAlerts">Emergency Alerts</Label>
        <Switch
          id="emergencyAlerts"
          checked={settings.emergencyAlerts}
          onCheckedChange={() => onChange("emergencyAlerts")}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="dailyReportDigest">Daily Report Digest</Label>
        <Switch
          id="dailyReportDigest"
          checked={settings.dailyReportDigest}
          onCheckedChange={() => onChange("dailyReportDigest")}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="statusUpdateAlerts">Status Update Alerts</Label>
        <Switch
          id="statusUpdateAlerts"
          checked={settings.statusUpdateAlerts}
          onCheckedChange={() => onChange("statusUpdateAlerts")}
        />
      </div>
    </div>
  );
};
export default NotificationSettings;
