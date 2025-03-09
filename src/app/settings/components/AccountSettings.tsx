import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, KeyRound, Save } from "lucide-react";

interface AccountSettingsProps {
  settings: {
    twoFactorAuth: boolean;
    sessionTimeout: string;
    dataCollection: boolean;
  };
  isLoading: boolean;
  errorMessage: string;
  success: boolean;
  onSettingChange: (setting: string, value: any) => void;
  onPasswordChange?: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
}

export default function AccountSettings({
  settings,
  onSettingChange,
  onPasswordChange,
  errorMessage,
  isLoading,
  success,
}: AccountSettingsProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  const handlePasswordInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setPasswordError("");
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setPasswordError("All fields are required");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    try {
      if (onPasswordChange) {
        await onPasswordChange(
          passwordData.currentPassword,
          passwordData.newPassword
        );
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  console.log(errorMessage);

  return (
    <div className="space-y-8">
      {/* Security Settings */}
      <div>
        <h3 className="text-lg font-medium mb-4">Security Settings</h3>
        <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="twoFactorAuth" className="font-medium">
                Two-Factor Authentication
              </Label>
              <p className="text-sm text-gray-500">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch
              id="twoFactorAuth"
              checked={settings.twoFactorAuth}
              onCheckedChange={(checked) =>
                onSettingChange("twoFactorAuth", checked)
              }
            />
          </div>

          <div className="pt-2 pb-2">
            <div className="border-t border-gray-200"></div>
          </div>

          <div>
            <div>
              <Label htmlFor="sessionTimeout" className="font-medium">
                Session Timeout
              </Label>
              <p className="text-sm text-gray-500 mb-2">
                Set how long until your session expires
              </p>
            </div>
            <select
              id="sessionTimeout"
              value={settings.sessionTimeout}
              onChange={(e) =>
                onSettingChange("sessionTimeout", e.target.value)
              }
              className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
            </select>
          </div>

          <div className="pt-2 pb-2">
            <div className="border-t border-gray-200"></div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dataCollection" className="font-medium">
                Data Collection
              </Label>
              <p className="text-sm text-gray-500">
                Allow usage data to improve your experience
              </p>
            </div>
            <Switch
              id="dataCollection"
              checked={settings.dataCollection}
              onCheckedChange={(checked) =>
                onSettingChange("dataCollection", checked)
              }
            />
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div>
        <h3 className="text-lg font-medium mb-4">Change Password</h3>
        <form
          onSubmit={handlePasswordSubmit}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-2 mb-4 bg-blue-50 p-3 rounded-md">
              <KeyRound className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                Choose a strong password to keep your account secure.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="font-medium">
                Current Password
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={handlePasswordInputChange}
                  className="pr-10 h-10"
                  placeholder="Enter your current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="font-medium">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={handlePasswordInputChange}
                  className="pr-10 h-10"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="font-medium">
                Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showNewPassword ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={handlePasswordInputChange}
                className="h-10"
                placeholder="Confirm your new password"
              />
            </div>

            {(errorMessage || passwordError) && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {errorMessage || passwordError}
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">
                Password updated successfully
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="mt-2 h-10 w-full flex items-center justify-center gap-2  text-white"
            >
              {isLoading ? (
                "Updating..."
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Update Password
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
