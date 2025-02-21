import Image from "next/legacy/image";
import { Edit2, Loader2 } from "lucide-react";

interface ProfileImageProps {
  profileImage: string;
  isEditing: boolean;
  imgUploading: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileImage = ({
  profileImage,
  isEditing,
  imgUploading,
  onImageUpload,
}: ProfileImageProps) => {
  return (
    <div className="relative w-32 h-32 mx-auto mb-4">
      <Image
        src={profileImage || ""}
        alt="Profile"
        width={128}
        height={128}
        objectFit="fill"
        priority
        className="rounded-full object-cover"
      />
      {imgUploading && (
        <div className="absolute bg-white/25 backdrop-blur-md rounded-full top-0 left-0 w-full h-full flex items-center justify-center">
          <Loader2 className="w-6 text-white h-6 animate-spin" />
        </div>
      )}
      {isEditing && (
        <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer">
          <Edit2 className="w-4 h-4" />
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={onImageUpload}
          />
        </label>
      )}
    </div>
  );
};
