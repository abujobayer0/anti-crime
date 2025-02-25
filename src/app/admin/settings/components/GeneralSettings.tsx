import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GeneralSettingsProps {
  settings: {
    platformName: string;
    supportEmail: string;
    emergencyContact: string;
    defaultLocation: string;
    languagePreference: string;
  };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const GeneralSettings = ({ settings, onChange }: GeneralSettingsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="platformName">Platform Name</Label>
        <Input
          id="platformName"
          name="platformName"
          value={settings.platformName}
          onChange={onChange}
        />
      </div>
      <div>
        <Label htmlFor="supportEmail">Support Email</Label>
        <Input
          id="supportEmail"
          name="supportEmail"
          type="email"
          value={settings.supportEmail}
          onChange={onChange}
        />
      </div>
      <div>
        <Label htmlFor="emergencyContact">Emergency Contact Number</Label>
        <Input
          id="emergencyContact"
          name="emergencyContact"
          value={settings.emergencyContact}
          onChange={onChange}
        />
      </div>
      <div>
        <Label htmlFor="defaultLocation">Default Location</Label>
        <Input
          id="defaultLocation"
          name="defaultLocation"
          value={settings.defaultLocation}
          onChange={onChange}
        />
      </div>
      <div>
        <Label htmlFor="languagePreference">Default Language</Label>
        <select
          id="languagePreference"
          name="languagePreference"
          className="w-full p-2 border rounded-md"
          value={settings.languagePreference}
          onChange={onChange}
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </div>
    </div>
  );
};
export default GeneralSettings;
