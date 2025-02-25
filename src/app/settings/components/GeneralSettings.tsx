import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface GeneralSettingsProps {
  settings: {
    language: string;
    timezone: string;
    autoSave: boolean;
    compactView: boolean;
  };
  onSettingChange: (setting: string, value: any) => void;
}

export default function GeneralSettings({
  settings,
  onSettingChange,
}: GeneralSettingsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="language">Language</Label>
        <select
          id="language"
          value={settings.language}
          onChange={(e) => onSettingChange("language", e.target.value)}
          className="w-full mt-1 rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </div>

      <div>
        <Label htmlFor="timezone">Timezone</Label>
        <select
          id="timezone"
          value={settings.timezone}
          onChange={(e) => onSettingChange("timezone", e.target.value)}
          className="w-full mt-1 rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        >
          <option value="UTC">UTC</option>
          <option value="EST">Eastern Time</option>
          <option value="PST">Pacific Time</option>
        </select>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="autoSave">Auto-save</Label>
        <Switch
          id="autoSave"
          checked={settings.autoSave}
          onCheckedChange={(checked) => onSettingChange("autoSave", checked)}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="compactView">Compact View</Label>
        <Switch
          id="compactView"
          checked={settings.compactView}
          onCheckedChange={(checked) => onSettingChange("compactView", checked)}
        />
      </div>
    </div>
  );
}
