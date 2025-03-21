import { CrimeReport, User } from "@/components/global/crime-report-card/types";
import { VoteButtons } from "@/components/global/crime-report-card/VoteButtons";
import { formatTimeAgo } from "@/lib/report";
import {
  Bookmark,
  ChevronLeft,
  Clock,
  Eye,
  Flag,
  Map,
  Share2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ShareButton from "./Share.Button";

const Hero = ({
  report,
  handleVote,
  primaryImage,
  user,
}: {
  report: CrimeReport;
  handleVote: ({
    id,
    type,
  }: {
    id: string;
    type: "upvote" | "downvote";
  }) => void;
  primaryImage: string;
  user: User;
}) => {
  return (
    <div className="relative">
      <div className="relative h-80 md:h-96 w-full overflow-hidden">
        <Image
          src={primaryImage}
          alt={report?.title}
          layout="fill"
          objectFit="cover"
          priority
          className="blur-sm scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40"></div>
      </div>

      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-white bg-black/30 hover:bg-black/50 transition-colors px-4 py-2 rounded-full"
        >
          <ChevronLeft size={16} />
          <span>Back to reports</span>
        </Link>
      </div>
      <div className="absolute top-6 right-6 z-10 flex gap-2">
        <ShareButton />
        <button className="bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-colors">
          <Bookmark size={18} />
        </button>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="absolute -bottom-12 left-0 right-0">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mx-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <Link
                  href={
                    user?._id === report?.userId?._id
                      ? "/profile"
                      : `/profile/${report?.userId?._id}`
                  }
                  className="relative group"
                >
                  <div className="absolute inset-0 rounded-full bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  <Image
                    src={report?.userId?.profileImage || "/anticrime-logo.png"}
                    alt="User"
                    width={48}
                    height={48}
                    objectFit="cover"
                    className="rounded-full ring-2 ring-primary/20"
                  />
                </Link>
                <div>
                  <Link
                    href={
                      user?._id === report?.userId?._id
                        ? "/profile"
                        : `/profile/${report?.userId?._id}`
                    }
                  >
                    <h2 className="text-base font-semibold hover:text-primary transition-colors">
                      {report?.userId?.name}
                    </h2>
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    Reported {formatTimeAgo(new Date(report?.createdAt))}
                  </p>
                </div>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold mb-6">
              {report?.title}
            </h1>

            <div className="flex flex-wrap gap-3 mb-4">
              <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full text-sm">
                <Clock className="text-gray-500 h-4 w-4" />
                <span className="font-medium">
                  {formatTimeAgo(new Date(report?.crimeTime))}
                </span>
              </div>
              <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full text-sm">
                <Map className="text-gray-500 h-4 w-4" />
                <span className="font-medium">
                  {report?.division}, {report?.district}
                </span>
              </div>
              <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full text-sm">
                <Eye className="text-gray-500 h-4 w-4" />
                <span className="font-medium">
                  {Math.floor(Math.random() * 1000) + 100} views
                </span>
              </div>
              <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full text-sm">
                <VoteButtons
                  initialUpvotes={report.upvotes.length}
                  initialDownvotes={report.downvotes.length}
                  initialUpvoters={report.upvotes}
                  initialDownvoters={report.downvotes}
                  currentUserId={user?._id}
                  onVote={(type) => handleVote({ id: report._id, type })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
