import { MessageCircle, ThumbsDown, ThumbsUp } from "lucide-react";
import Link from "next/link";
import React from "react";
import Image from "next/legacy/image";

const RecentReportCard = ({ report }: { report: any }) => {
  return (
    <div className="flex gap-2 p-2 items-start  hover:bg-gray-50  ">
      <Link href={`/reports/${report?._id}`}>
        <Image
          src={report?.images?.[0] || ""}
          alt="Crime Scene"
          width={80}
          height={80}
          loading="eager"
          unoptimized
          priority
          quality={100}
          className="rounded-sm object-cover"
        />
      </Link>
      <div className="flex-1 leading-2 text-sm">
        <Link href={`/reports/${report?._id}`}>
          <h3 className="font-medium line-clamp-1">{report?.title}</h3>
          <p className="text-gray-600 line-clamp-1">{report?.description}</p>
        </Link>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
          <span className="flex items-center gap-1">
            <ThumbsUp className="h-3 w-3" />
            <span>{report?.upvotes?.length || 0}</span>
          </span>
          <span className="flex items-center gap-1">
            <ThumbsDown className="h-3 w-3" />
            <span>{report?.downvotes?.length || 0}</span>
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-3 w-3" />
            <span>{report?.comments?.length || 0}</span>
          </span>
          <span>{new Date(report?.createdAt).toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

export default RecentReportCard;
