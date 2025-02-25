"use client";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DevBanner from "@/components/global/settings/DevBanner";
import GeneralSettings from "./components/GeneralSettings";
import ReportSettings from "./components/ReportSettings";
import NotificationSettings from "./components/NotificationSettings";
import SystemSettings from "./components/SystemSettings";

const SettingsPage = () => {
  const { toast } = useToast();

  const [generalSettings, setGeneralSettings] = useState({
    platformName: "Crime Reporting Platform",
    supportEmail: "support@crimereporting.com",
    emergencyContact: "911",
    defaultLocation: "City Center",
    languagePreference: "en",
  });

  const [reportSettings, setReportSettings] = useState({
    enableAnonymousReporting: true,
    requireLocationData: true,
    allowMediaUploads: true,
    maxMediaSize: 10,
    autoArchiveDays: 30,
    categoriesEnabled: true,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    emergencyAlerts: true,
    dailyReportDigest: true,
    statusUpdateAlerts: true,
  });

  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    dataRetentionDays: 365,
    backupFrequency: "daily",
    maxReportSize: 50,
    enableAnalytics: true,
    enableApiAccess: false,
  });

  const handleGeneralSettingsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setGeneralSettings({
      ...generalSettings,
      [e.target.name]: e.target.value,
    });
  };

  const handleReportSettingsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setReportSettings({
      ...reportSettings,
      [e.target.name]: value,
    });
  };

  const handleReportSwitchChange = (name: string, checked: boolean) => {
    setReportSettings({
      ...reportSettings,
      [name]: checked,
    });
  };

  const handleNotificationSettingsChange = (setting: string) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]:
        !notificationSettings[setting as keyof typeof notificationSettings],
    });
  };

  const handleSystemSettingsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setSystemSettings({
      ...systemSettings,
      [e.target.name]: e.target.value,
    });
  };

  const handleSystemSwitchChange = (name: string, checked: boolean) => {
    setSystemSettings({
      ...systemSettings,
      [name]: checked,
    });
  };

  const handleSaveSettings = () => {
    // Here you would typically save the settings to your backend
    console.log("Saving settings:", {
      generalSettings,
      notificationSettings,
      systemSettings,
      reportSettings,
    });
    toast({
      title: "Settings Saved",
      description: "Your changes have been successfully saved.",
    });
  };

  return (
    <main className="flex-1 overflow-y-auto p-8">
      <DevBanner
        message="This settings page is currently under development. Functionality is
            not yet implemented."
      />
      <h1 className="text-3xl font-bold mb-6">Admin Settings</h1>
      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="reports">Report Settings</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralSettings
            settings={generalSettings}
            onChange={handleGeneralSettingsChange}
          />
        </TabsContent>

        <TabsContent value="reports">
          <ReportSettings
            settings={reportSettings}
            onChange={handleReportSettingsChange}
            onSwitchChange={handleReportSwitchChange}
          />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings
            settings={notificationSettings}
            onChange={handleNotificationSettingsChange}
          />
        </TabsContent>

        <TabsContent value="system">
          <SystemSettings
            settings={systemSettings}
            onChange={handleSystemSettingsChange}
            onSwitchChange={handleSystemSwitchChange}
          />
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Button onClick={handleSaveSettings}>Save Settings</Button>
      </div>
    </main>
  );
};
export default SettingsPage;
