import { DescriptionWithHashtags } from "@/lib/helpers";
import { formatTimeAgo } from "@/lib/report";
import {
  MapPin,
  MessageSquare,
  Video,
  EllipsisVertical,
  Archive,
  RotateCcw,
} from "lucide-react";
import Image from "next/legacy/image";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { GlobalPopover } from "@/components/global/global-popover";

const ReportCard = ({
  report,
  onUpdate,
  isPreview,
}: {
  report: any;
  onDelete?: (id: string) => void;
  onUpdate?: (data: { id: string; data: any }) => void;
  isPreview?: boolean;
}) => {
  return (
    <div
      key={report._id}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-2">
            <Link href={`/reports/${report._id}`}>
              <h4 className="text-xl font-semibold text-gray-900 hover:text-primary transition-colors">
                {report.title}
              </h4>
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>
                  {report.district}, {report.division}
                </span>
              </div>
            </div>
          </div>
          {!isPreview && (
            <div className="flex items-center gap-2">
              <GlobalPopover
                align="end"
                action={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-gray-100 rounded-full h-9 w-9"
                  >
                    <EllipsisVertical className="h-5 w-5 text-gray-600" />
                  </Button>
                }
                content={
                  <>
                    {onUpdate &&
                      (report.isDeleted ? (
                        <Button
                          onClick={() =>
                            onUpdate({
                              id: report._id,
                              data: { isDeleted: false },
                            })
                          }
                          variant="ghost"
                          className="flex w-full justify-start text-sm gap-2  hover:bg-muted-foreground/10"
                        >
                          <RotateCcw size={16} /> Undo Archive
                        </Button>
                      ) : (
                        <Button
                          onClick={() =>
                            onUpdate({
                              id: report._id,
                              data: { isDeleted: true },
                            })
                          }
                          variant="ghost"
                          className="flex w-full justify-start text-sm gap-2 hover:bg-muted-foreground/10"
                        >
                          <Archive size={16} /> Archive Report
                        </Button>
                      ))}
                  </>
                }
              />
              {report.isDeleted ? (
                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs">
                  Deleted
                </span>
              ) : (
                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs">
                  Active
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-4 mb-6">
          {report.images && report.images.length > 0 && (
            <div className="flex gap-2">
              {report.images.slice(0, 2).map((image: string, index: number) => (
                <div
                  key={index}
                  className="relative w-32 h-32 rounded-lg overflow-hidden"
                >
                  <Image
                    src={image || ""}
                    alt={`Crime Report Image ${index + 1}`}
                    width={128}
                    height={128}
                    objectFit="cover"
                    loading="lazy"
                    unoptimized
                    className="object-cover hover:scale-105 transition-transform"
                  />
                </div>
              ))}
              {report.images.length > 2 && (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                  <span className="text-lg font-semibold text-gray-600">
                    +{report.images.length - 2}
                  </span>
                </div>
              )}
            </div>
          )}
          {report.video && (
            <div className="relative w-64 h-32 rounded-lg overflow-hidden">
              <video
                src={report.video}
                controls
                className="w-full h-full object-cover"
                poster="/video-thumbnail.png"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>

        <div className="mb-6 text-gray-700 line-clamp-6">
          <DescriptionWithHashtags text={report.description} />
        </div>

        <div className="flex flex-wrap gap-6 items-center text-sm text-muted-foreground mb-6 pb-6 border-b">
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-full">
            <span className="font-medium">Posted:</span>
            {formatTimeAgo(new Date(report.postTime))}
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-full">
            <span className="font-medium">Crime Time:</span>
            {new Date(report.crimeTime).toLocaleString()}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm px-3 py-1 bg-green-50 text-green-600 rounded-full">
            <span className="font-medium">{report.upvotes.length}</span>
            <span>upvotes</span>
          </div>
          <Link
            href={`/reports/${report._id}`}
            className="gap-2 flex items-center p-2 hover:bg-blue-50 hover:text-blue-600"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="font-medium">{report.comments.length}</span>
            <span className="text-muted-foreground">comments</span>
          </Link>
          {report.video && (
            <div className="flex items-center gap-2 text-sm px-3 py-1 bg-gray-50 rounded-full">
              <Video className="w-4 h-4" />
              <span className="text-muted-foreground">Video Available</span>
            </div>
          )}
          {report.downvotes.length > 0 && (
            <div className="flex items-center gap-2 text-sm px-3 py-1 bg-red-50 text-red-600 rounded-full">
              <span className="font-medium">{report.downvotes.length}</span>
              <span>downvotes</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
