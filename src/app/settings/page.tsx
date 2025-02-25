"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import DevBanner from "@/components/global/settings/DevBanner";
import GeneralSettings from "./components/GeneralSettings";
import ThemeSettings from "./components/ThemeSettings";
import AccountSettings from "./components/AccountSettings";

export default function UserSettingsPage() {
  const { toast } = useToast();
  const [appSettings, setAppSettings] = useState({
    language: "en",
    timezone: "UTC",
    autoSave: true,
    compactView: false,
  });
  const [themeSettings, setThemeSettings] = useState({
    darkMode: false,
    fontSize: "medium",
    highContrast: false,
  });
  const [accountSettings, setAccountSettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
    dataCollection: true,
  });

  useEffect(() => {
    toast({
      title: "Under Development",
      description:
        "Settings functionality is currently under development and changes will not be saved.",
      duration: 5000,
    });
  }, [toast]);

  const handleSaveSettings = async () => {
    try {
      // API call to save settings would go here
      toast({
        title: "Settings saved",
        description: "Your settings have been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
      });
    }
  };

  return (
    <main className="flex-1 p-8">
      <DevBanner
        message=" This settings page is currently under development. Functionality is
            not yet implemented."
      />
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralSettings
            settings={appSettings}
            onSettingChange={(setting, value) =>
              setAppSettings({ ...appSettings, [setting]: value })
            }
          />
        </TabsContent>

        <TabsContent value="theme">
          <ThemeSettings
            settings={themeSettings}
            onSettingChange={(setting, value) =>
              setThemeSettings({ ...themeSettings, [setting]: value })
            }
          />
        </TabsContent>

        <TabsContent value="account">
          <AccountSettings
            settings={accountSettings}
            onSettingChange={(setting, value) =>
              setAccountSettings({ ...accountSettings, [setting]: value })
            }
          />
        </TabsContent>
      </Tabs>
      <div className="mt-6">
        <Button onClick={handleSaveSettings}>Save Settings</Button>
      </div>
    </main>
  );
}
