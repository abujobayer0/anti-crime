import React from "react";
import Image from "next/legacy/image";
import { AlertCircle } from "lucide-react";
import { useReportFormContext } from "./ReportFormContext";

interface Props {
  user: any;
}

const ReportHeader = ({ user }: Props) => {
  const { formData, handleChange } = useReportFormContext();
  const userName = user?.name || "Anonymous";

  return (
    <div className="p-5 border-b border-border/10">
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10">
          <Image
            src={user?.profileImage || "/anticrime-logo.png"}
            alt={userName}
            objectFit="cover"
            sizes="40px"
            width={40}
            unoptimized
            loading="eager"
            height={40}
            priority
            className="rounded-full object-cover ring-2 ring-primary/5"
          />
          {!user?.isVerified && (
            <div className="absolute -top-1 -right-1 bg-destructive/10 text-destructive p-1 rounded-full">
              <AlertCircle className="w-3 h-3" />
            </div>
          )}
        </div>
        <input
          type="text"
          placeholder={`What crime incident would you like to report, ${userName}?`}
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-full border bg-muted/30 hover:bg-muted/50 transition-colors text-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-primary/20"
        />
      </div>
    </div>
  );
};

export default ReportHeader;
