import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface AccountSettingsProps {
  settings: {
    twoFactorAuth: boolean;
    sessionTimeout: string;
    dataCollection: boolean;
  };
  onSettingChange: (setting: string, value: any) => void;
}

export default function AccountSettings({
  settings,
  onSettingChange,
}: AccountSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
        <Switch
          id="twoFactorAuth"
          checked={settings.twoFactorAuth}
          onCheckedChange={(checked) =>
            onSettingChange("twoFactorAuth", checked)
          }
        />
      </div>

      <div>
        <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
        <select
          id="sessionTimeout"
          value={settings.sessionTimeout}
          onChange={(e) => onSettingChange("sessionTimeout", e.target.value)}
          className="w-full mt-1 rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        >
          <option value="15">15 minutes</option>
          <option value="30">30 minutes</option>
          <option value="60">1 hour</option>
        </select>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="dataCollection">Data Collection</Label>
        <Switch
          id="dataCollection"
          checked={settings.dataCollection}
          onCheckedChange={(checked) =>
            onSettingChange("dataCollection", checked)
          }
        />
      </div>
    </div>
  );
}
