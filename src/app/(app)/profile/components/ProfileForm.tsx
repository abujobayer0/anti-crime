import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProfileFormProps {
  profileData: any;
  setProfileData: (data: any) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  imgUploading: boolean;
}

export const ProfileForm = ({
  profileData,
  setProfileData,
  onSubmit,
  onCancel,
  imgUploading,
}: ProfileFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        value={profileData.name}
        onChange={(e) =>
          setProfileData({ ...profileData, name: e.target.value })
        }
        placeholder="Name"
      />
      <Input
        value={profileData.email}
        onChange={(e) =>
          setProfileData({ ...profileData, email: e.target.value })
        }
        placeholder="Email"
        type="email"
        disabled
      />
      <Input
        value={profileData.phone}
        onChange={(e) =>
          setProfileData({ ...profileData, phone: e.target.value })
        }
        placeholder="Phone"
        type="tel"
      />
      <Textarea
        value={profileData.bio}
        onChange={(e) =>
          setProfileData({ ...profileData, bio: e.target.value })
        }
        placeholder="Bio"
        className="resize-none"
      />
      <div className="flex gap-2">
        <Button type="submit" disabled={imgUploading} className="flex-1">
          Save
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
