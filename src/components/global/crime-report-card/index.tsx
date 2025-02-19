"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Props } from "./types";
import { CommentsSection } from "../comments-section";
import Image from "next/legacy/image";
import { GlobalPopover } from "../global-popover";
import { Button } from "@/components/ui/button";
import { VoteButtons } from "./VoteButtons";

import {
  EllipsisVertical,
  LocateIcon,
  Siren,
  TimerIcon,
  Trash2,
  Edit2,
} from "lucide-react";
import { formatTimeAgo } from "@/lib/report";
import { getImageClass } from "@/lib/utils";
import { DescriptionWithHashtags } from "@/lib/helpers";
const CrimeReportCard = ({
  report,
  deleteReport,
  updateReport,
  voteReport,
  user,
}: Props) => {
  const [collapsedDescription, setCollapsedDescription] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedReport, setEditedReport] = useState({
    title: report.title,
    description: report.description,
  });

  const description =
    report?.description?.length > 300 && !collapsedDescription
      ? report.description.slice(0, 300)
      : report?.description;

  return (
    <div className="flex flex-col max-w-screen-md relative w-full mx-auto rounded-lg bg-white border  transition-all duration-200">
      <div className="flex relative items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Image
            src={report?.userId?.profileImage || "/anticrime-logo.png"}
            alt="user"
            width={40}
            height={40}
            priority
            className="rounded-full object-cover ring-2 ring-primary/5"
          />
          <div>
            <div className="text-[15px] font-semibold hover:underline cursor-pointer">
              {report?.userId?.name}
            </div>
            <p className="text-[13px] text-gray-500">
              {formatTimeAgo(new Date(report?.postTime))}
            </p>
          </div>
        </div>
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
              <Button
                variant="ghost"
                className="flex w-full justify-start text-sm gap-2 text-primary hover:text-primary/80 hover:bg-primary/10"
              >
                <Siren size={16} /> Emergency Contact
              </Button>
              {report?.userId?._id === user?._id && (
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="ghost"
                  className="flex w-full justify-start text-sm gap-2 text-primary hover:text-primary/80 hover:bg-primary/10"
                >
                  <Edit2 size={16} />{" "}
                  {isEditing ? "Cancel Edit" : "Edit Report"}
                </Button>
              )}
              {report?.userId?._id === user?._id && (
                <Button
                  onClick={() => deleteReport(report._id)}
                  variant="ghost"
                  className="flex w-full justify-start text-sm gap-2 text-primary hover:text-primary/80 hover:bg-primary/10"
                >
                  <Trash2 size={16} /> Delete Report
                </Button>
              )}
            </>
          }
        />
      </div>

      <div className="px-4 py-3 space-y-3">
        <div className="space-y-2">
          {isEditing ? (
            <input
              type="text"
              value={editedReport.title}
              onChange={(e) =>
                setEditedReport((prev) => ({ ...prev, title: e.target.value }))
              }
              className="text-xl font-medium w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          ) : (
            <Link
              href={`/reports/${report._id}`}
              className="text-xl font-medium hover:underline"
            >
              {report?.title}
            </Link>
          )}

          <div className="flex flex-wrap gap-3 text-[13px] text-gray-500">
            <div className="flex items-center gap-1.5">
              <LocateIcon size={14} />
              <span>
                {report?.division}, {report?.district}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <TimerIcon size={14} />
              <span>
                Crime Time:
                {formatTimeAgo(new Date(report?.crimeTime))}
              </span>
            </div>
          </div>
        </div>

        <div className="text-[15px] text-gray-700 leading-relaxed">
          {isEditing ? (
            <textarea
              value={editedReport.description}
              onChange={(e) =>
                setEditedReport((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none min-h-[150px]"
            />
          ) : (
            <DescriptionWithHashtags text={description} />
          )}
          {report?.description?.length > 300 && (
            <Button
              variant="link"
              className="px-0 text-primary text-[13px] font-medium"
              onClick={() => setCollapsedDescription((prev) => !prev)}
            >
              {collapsedDescription ? "Show less" : "Show more"}
            </Button>
          )}
        </div>

        {report?.images?.length > 0 && (
          <div
            className={`grid gap-1 ${
              report.images.length === 1 ? "" : "grid-cols-2"
            } rounded-lg overflow-hidden`}
          >
            {report.images
              .slice(0, Math.min(6, report.images.length))
              .map((image: string, index: number) => {
                return (
                  <div
                    key={index}
                    className={`relative overflow-hidden rounded-md ${getImageClass(
                      report.images,
                      index
                    )}`}
                  >
                    <Image
                      src={image}
                      alt={`crime scene ${index + 1}`}
                      width={100}
                      height={100}
                      priority
                      quality={500}
                      loading="eager"
                      unoptimized
                      layout="fill"
                      objectFit="cover"
                      objectPosition="center"
                      lazyBoundary="200px"
                      lazyRoot={null}
                      className="object-covoer hover:scale-105 transition-all duration-300"
                    />
                    {index === 5 && report.images.length > 6 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white text-2xl font-semibold">
                          +{report.images.length - 6}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-4">
          {isEditing ? (
            <div className="flex gap-2">
              <Button
                variant="default"
                onClick={() => {
                  updateReport({ id: report._id, data: editedReport });
                  setIsEditing(false);
                }}
                className="bg-primary text-white hover:bg-primary/90 text-[13px]"
              >
                Save Changes
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsEditing(false)}
                className="text-gray-500 text-[13px]"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex gap-4 justify-between w-full py-1">
              <VoteButtons
                initialUpvotes={report.upvotes.length}
                initialDownvotes={report.downvotes.length}
                initialUpvoters={report.upvotes}
                initialDownvoters={report.downvotes}
                currentUserId={user?._id}
                onVote={(type) => voteReport({ id: report._id, type })}
              />
            </div>
          )}
        </div>

        {!isEditing && (
          <CommentsSection
            comments={report?.comments}
            reportId={report._id}
            userImage={user?.profileImage}
          />
        )}
      </div>
    </div>
  );
};
export default CrimeReportCard;
