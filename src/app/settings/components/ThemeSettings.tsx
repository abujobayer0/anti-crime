import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ThemeSettingsProps {
  settings: {
    darkMode: boolean;
    fontSize: string;
    highContrast: boolean;
  };
  onSettingChange: (setting: string, value: any) => void;
}

export default function ThemeSettings({
  settings,
  onSettingChange,
}: ThemeSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="darkMode">Dark Mode</Label>
        <Switch
          id="darkMode"
          checked={settings.darkMode}
          onCheckedChange={(checked) => onSettingChange("darkMode", checked)}
        />
      </div>

      <div>
        <Label htmlFor="fontSize">Font Size</Label>
        <select
          id="fontSize"
          value={settings.fontSize}
          onChange={(e) => onSettingChange("fontSize", e.target.value)}
          className="w-full mt-1 rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="highContrast">High Contrast</Label>
        <Switch
          id="highContrast"
          checked={settings.highContrast}
          onCheckedChange={(checked) =>
            onSettingChange("highContrast", checked)
          }
        />
      </div>
    </div>
  );
}
