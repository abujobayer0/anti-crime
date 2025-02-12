"use client";
import Image from "next/image";
import React, { useState } from "react";
import { GlobalPopover } from "../global-popover";
import { Button } from "@/components/ui/button";

import {
  EllipsisVertical,
  LocateIcon,
  Siren,
  TimerIcon,
  ThumbsUp,
  ThumbsDown,
  Trash2,
  Edit2,
} from "lucide-react";

import Link from "next/link";
import { EvidenceModal } from "../evidence-modal";
import axios from "axios";
import { toast } from "sonner";
interface User {
  _id: string;
  name: string;
  profileImage: string;
  isVerified: boolean;
}

interface CrimeReport {
  _id: string;
  userId: User;
  title: string;
  description: string;
  images: string[];
  division: string;
  district: string;
  crimeTime: string;
  upvotes: string[];
  downvotes: string[];
  comments: any[];
}

interface Props {
  report: CrimeReport;
  deleteReport: (id: string) => void;
}

const CrimeReportCard = ({ report, deleteReport }: Props) => {
  const [collapsedDescription, setCollapsedDescription] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedReport, setEditedReport] = useState({
    title: report.title,
    description: report.description,
  });
  const [votes, setVotes] = useState({
    upvotes: report.upvotes.length,
    downvotes: report.downvotes.length,
  });

  const description =
    report?.description?.length > 300 && !collapsedDescription
      ? report.description.slice(0, 300)
      : report?.description;

  const handleEvidenceSubmit = (evidence: {
    description: string;
    images: File[];
    video: File | null;
  }) => {
    console.log("Evidence submitted:", evidence);
  };

  const handleSaveEdit = async () => {
    const response = await axios.patch(
      `http://localhost:5001/api/v1/reports/${report._id}`,
      editedReport
    );
    if (response.status === 200) {
      toast.success("Report updated successfully");
    }
    console.log("Saving edits:", editedReport);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col relative w-full mx-auto rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex relative items-center justify-between p-6 border-b border-border/60">
        <div className="flex items-center gap-4">
          <Image
            src={report?.userId?.profileImage}
            alt="user"
            width={48}
            height={48}
            className="rounded-full object-cover ring-2 ring-primary/10"
          />
          <div>
            <div className="text-lg font-semibold">{report?.userId?.name}</div>
            <p className="text-sm text-muted-foreground">
              {new Date(report?.crimeTime).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        <GlobalPopover
          align="end"
          action={
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-destructive/10"
            >
              <EllipsisVertical className="h-5 w-5 text-muted-foreground" />
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
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="ghost"
                className="flex w-full justify-start text-sm gap-2 text-primary hover:text-primary/80 hover:bg-primary/10"
              >
                <Edit2 size={16} /> {isEditing ? "Cancel Edit" : "Edit Report"}
              </Button>
              <Button
                onClick={() => deleteReport(report._id)}
                variant="ghost"
                className="flex w-full justify-start text-sm gap-2 text-primary hover:text-primary/80 hover:bg-primary/10"
              >
                <Trash2 size={16} /> Delete Report
              </Button>
            </>
          }
        />
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-4">
          {isEditing ? (
            <input
              type="text"
              value={editedReport.title}
              onChange={(e) =>
                setEditedReport((prev) => ({ ...prev, title: e.target.value }))
              }
              className="text-2xl font-bold w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          ) : (
            <Link
              href={`/reports/${report._id}`}
              className="text-2xl font-bold hover:text-primary transition-colors"
            >
              {report?.title}
            </Link>
          )}

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

        <div className="text-gray-700 leading-relaxed">
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
            <p>{description}</p>
          )}
          {report?.description?.length > 300 && (
            <Button
              variant="link"
              className="px-0 text-primary"
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
            }`}
          >
            {report.images
              .slice(0, Math.min(6, report.images.length))
              .map((image: string, index: number) => {
                // Calculate layout classes based on number of images and position
                const getImageClass = () => {
                  if (report.images.length === 1) return "aspect-video w-full";
                  if (report.images.length === 2) return "aspect-square";
                  if (report.images.length === 3 && index === 0)
                    return "col-span-2 aspect-[2/1.5]";
                  if (report.images.length === 4 && index <= 1)
                    return "aspect-[2/1.5]";
                  if (report.images.length >= 5 && index === 0)
                    return "col-span-2 aspect-[2/1.5]";
                  return "aspect-square";
                };

                return (
                  <div
                    key={index}
                    className={`relative overflow-hidden rounded-md ${getImageClass()}`}
                  >
                    <Image
                      src={image}
                      alt={`crime scene ${index + 1}`}
                      fill
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

        <div className="flex items-center justify-between pt-4">
          {isEditing ? (
            <div className="flex gap-2">
              <Button
                variant="default"
                onClick={handleSaveEdit}
                className="bg-primary text-white hover:bg-primary/90"
              >
                Save Changes
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsEditing(false)}
                className="text-gray-500"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Button
                variant="ghost"
                size="sm"
                className={`gap-2 ${votes.upvotes > 0 ? "text-green-600" : ""}`}
                onClick={() =>
                  setVotes((prev) => ({ ...prev, upvotes: prev.upvotes + 1 }))
                }
              >
                <ThumbsUp className="h-4 w-4" />
                <span>{votes.upvotes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`gap-2 ${votes.downvotes > 0 ? "text-red-600" : ""}`}
                onClick={() =>
                  setVotes((prev) => ({
                    ...prev,
                    downvotes: prev.downvotes + 1,
                  }))
                }
              >
                <ThumbsDown className="h-4 w-4" />
                <span>{votes.downvotes}</span>
              </Button>
            </div>
          )}

          {!isEditing && <EvidenceModal onSubmit={handleEvidenceSubmit} />}
        </div>
      </div>
    </div>
  );
};
export default CrimeReportCard;
