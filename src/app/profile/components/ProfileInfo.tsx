import { Mail, Phone, Shield, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileInfoProps {
  profileData: any;
  onEdit: () => void;
}

export const ProfileInfo = ({ profileData, onEdit }: ProfileInfoProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center">{profileData.name}</h2>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail className="w-4 h-4" />
          <span>{profileData.email}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="w-4 h-4" />
          <span>{profileData.phone}</span>
        </div>
        {profileData.role === "admin" && (
          <div className="flex items-center gap-2 text-primary">
            <Shield className="w-4 h-4" />
            <span>Admin</span>
          </div>
        )}
        {!profileData.isVerified && (
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-4 h-4" />
            <span>Unverified Account</span>
          </div>
        )}
      </div>
      <Button onClick={onEdit} variant="outline" className="w-full">
        Edit Profile
      </Button>
    </div>
  );
};
