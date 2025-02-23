import { Mail, Phone, Shield, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileInfoProps {
  profileData: any;
  onEdit: () => void;
}

export const ProfileInfo = ({ profileData, onEdit }: ProfileInfoProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">{profileData.name}</h2>
          <button
            onClick={onEdit}
            className="text-sm px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
          >
            Edit Profile
          </button>
        </div>
        <p className="text-muted-foreground">{profileData.bio}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Email</p>
          <p className="font-medium">{profileData.email}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Phone</p>
          <p className="font-medium">{profileData.phone || "Not provided"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Role</p>
          <p className="font-medium capitalize">{profileData.role}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Status</p>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
              profileData.isVerified
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {profileData.isVerified ? "Verified" : "Unverified"}
          </span>
        </div>
      </div>
    </div>
  );
};
