import Image from "next/legacy/image";
import { LocateIcon, TimerIcon, MessageSquare } from "lucide-react";
import { CommentsSection } from "../../comments-section";
import type { CrimeReport, User } from "../../crime-report-card/types";
import { VoteButtons } from "../../crime-report-card/VoteButtons";
import { useReports } from "@/hooks";
import { formatTimeAgo } from "@/lib/report";
import { DescriptionWithHashtags } from "@/lib/helpers";

interface ViewProps {
  report: CrimeReport;
  user: User;
}

export const ReportDetailsView = ({ report, user }: ViewProps) => {
  const { voteReport } = useReports();

  const handleVote = (props: { id: string; type: "upvote" | "downvote" }) => {
    voteReport.mutate(props);
  };

  return (
    <div className="container z-[-1] mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-4">
              <Image
                src={report?.userId?.profileImage || "/anticrime-logo.png"}
                alt="User"
                width={48}
                height={48}
                className="rounded-full ring-2 ring-primary/10"
              />
              <div>
                <h2 className="text-lg font-semibold">
                  {report?.userId?.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {formatTimeAgo(new Date(report?.crimeTime))}
                </p>
              </div>
            </div>

            <h1 className="text-2xl font-bold">{report?.title}</h1>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <LocateIcon size={16} />
                <span>
                  {report?.division}, {report?.district}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TimerIcon size={16} />
                <span>
                  Crime Time: {formatTimeAgo(new Date(report?.crimeTime))}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white text-gray-700 rounded-xl shadow-sm p-6">
            <DescriptionWithHashtags text={report?.description} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {report?.images?.slice(0, 4).map((image: string, index: number) => (
              <div
                key={index}
                className={`relative rounded-xl overflow-hidden ${
                  index === 0 ? "col-span-2 aspect-video" : "aspect-square"
                }`}
              >
                <Image
                  src={image}
                  alt={`Evidence ${index + 1}`}
                  width={100}
                  height={100}
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center"
                  loading="eager"
                  unoptimized
                  priority
                  quality={500}
                  className="object-cover hover:scale-105 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:max-w-xl space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Evidence & Comments
              </h3>
              <VoteButtons
                initialUpvotes={report.upvotes.length}
                initialDownvotes={report.downvotes.length}
                initialUpvoters={report.upvotes}
                initialDownvoters={report.downvotes}
                currentUserId={user?._id}
                onVote={(type) => handleVote({ id: report._id, type })}
              />
            </div>
            <CommentsSection
              comments={report.comments}
              reportId={report._id}
              userImage={user?.profileImage}
              open={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
