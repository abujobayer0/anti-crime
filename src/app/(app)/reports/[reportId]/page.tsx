"use client";

import {
  LocateIcon,
  TimerIcon,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import { useReports } from "@/hooks/api/useReports";

import { EvidenceModal } from "@/components/global/evidence-modal";
import { useParams } from "next/navigation";
const ReportDetailsPage = () => {
  const params = useParams();
  const { getReport } = useReports();

  const { data: report, isLoading } = getReport(params.reportId as string);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container z-[-1] mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-4">
              <Image
                src={report?.userId?.profileImage}
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
                  {new Date(report?.crimeTime).toLocaleDateString()}
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
                  Crime Time: {new Date(report?.crimeTime).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-gray-700 leading-relaxed">
              {report?.description}
            </p>
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
                  fill
                  className="object-cover hover:scale-105 transition-all duration-300"
                />
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
            <div className="flex gap-4">
              <Button variant="ghost" size="sm" className="gap-2">
                <ThumbsUp className="w-4 h-4" />
                <span>{report?.upvotes.length}</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <ThumbsDown className="w-4 h-4" />
                <span>{report?.downvotes.length}</span>
              </Button>
            </div>
            <EvidenceModal reportId={params.reportId as string} />
          </div>
        </div>

        <div className="lg:w-[380px] space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Evidence & Comments
            </h3>

            <div className="space-y-4">
              {report?.comments.map((comment: any, index: number) => (
                <div key={index} className="pb-4 border-b last:border-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Image
                      src={comment.user.profileImage}
                      alt={comment.user.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-medium text-sm">{comment.user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {comment.comment}
                  </p>
                  {comment.proofImage && (
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      <Image
                        src={comment.proofImage}
                        alt="Evidence"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailsPage;
