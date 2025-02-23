import Image from "next/legacy/image";
import { Edit2, Loader2, Camera } from "lucide-react";

interface ProfileImageProps {
  profileImage: string;
  isEditing: boolean;
  imgUploading: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  size?: "default" | "xl";
}

export const ProfileImage = ({
  profileImage,
  isEditing,
  imgUploading,
  onImageUpload,
  size = "default",
}: ProfileImageProps) => {
  const sizeClasses = {
    default: "w-24 h-24",
    xl: "w-32 h-32",
  };

  return (
    <div className="relative group">
      <div
        className={`${sizeClasses[size]} relative rounded-full overflow-hidden border-4 border-background shadow-xl`}
      >
        <Image
          src={profileImage || "/anticrime-logo.png"}
          alt="Profile"
          layout="fill"
          className="object-cover"
        />
        {isEditing && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onImageUpload}
                disabled={imgUploading}
              />
              <Camera className="w-6 h-6 text-white" />
            </label>
          </div>
        )}
      </div>
      {imgUploading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
};
