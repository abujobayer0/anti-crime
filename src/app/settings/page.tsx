"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DevBanner from "@/components/global/settings/DevBanner";
import GeneralSettings from "./components/GeneralSettings";
import ThemeSettings from "./components/ThemeSettings";
import AccountSettings from "./components/AccountSettings";
import { useAuth } from "@/hooks";

export default function UserSettingsPage() {
  const { changePassword } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordUpdatesuccess, setPasswordUpdatesuccess] = useState(false);

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
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveSettings = async () => {};

  const onPasswordChange = async (
    currentPassword: string,
    newPassword: string
  ) => {
    setErrorMessage("");
    setIsLoading(true);
    try {
      await changePassword.mutateAsync({
        currentPassword,
        newPassword,
      });
      setPasswordUpdatesuccess(true);
      setErrorMessage("");
      setIsLoading(false);
    } catch (error: any) {
      setErrorMessage(error.response.data.message);
      setIsLoading(false);
      setPasswordUpdatesuccess(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <DevBanner message="This settings page is currently under development. Functionality is not yet implemented." />
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
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
            isLoading={isLoading}
            errorMessage={errorMessage}
            settings={accountSettings}
            success={passwordUpdatesuccess}
            onSettingChange={(setting, value) =>
              setAccountSettings({ ...accountSettings, [setting]: value })
            }
            onPasswordChange={onPasswordChange}
          />
        </TabsContent>
      </Tabs>
      <div className="mt-8">
        <Button onClick={handleSaveSettings}>Save Settings</Button>
      </div>
    </div>
  );
}
