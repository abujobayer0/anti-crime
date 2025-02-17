"use client";
import Image from "next/image";
import React, { useState } from "react";
import { GlobalPopover } from "../global-popover";
import { Button } from "@/components/ui/button";
import { MessageCircle, ImagePlus, X } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

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

import { uploadFileToImageBB } from "@/lib/utils";
import { useReports } from "@/hooks/api/useReports";
import CommentItem from "../comments-items";
import { Comment, Props } from "./types";

const CrimeReportCard = ({
  report,
  deleteReport,
  updateReport,
  voteReport,
}: Props) => {
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

  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState<string>("");

  const [commentImages, setCommentImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { addEvidence: addComment } = useReports();

  const description =
    report?.description?.length > 300 && !collapsedDescription
      ? report.description.slice(0, 300)
      : report?.description;

  const handleVote = (type: "upvote" | "downvote") => {
    voteReport.mutate({ id: report._id, type });
  };

  const handleCommentFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setCommentImages((prev) => [...prev, ...Array.from(files)]);
  };

  const removeCommentImage = (index: number) => {
    setCommentImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCommentSubmit = async () => {
    if (!newComment && commentImages.length === 0) return;
    setIsUploading(true);

    try {
      const uploadedImageUrls = await Promise.all(
        commentImages.map(async (image) => {
          const imageUrl = await uploadFileToImageBB(image);
          return imageUrl;
        })
      );

      await addComment.mutateAsync({
        reportId: report._id,
        evidence: {
          description: newComment,
          proofImage: uploadedImageUrls,
        },
      });

      setNewComment("");
      setCommentImages([]);
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col max-w-screen-lg relative w-full mx-auto rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex relative items-center justify-between p-6 border-b border-border/60">
        <div className="flex items-center gap-4">
          <Image
            src={report?.userId?.profileImage || "/anticrime-logo.png"}
            alt="user"
            width={48}
            priority
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
                onClick={() => deleteReport.mutate(report._id)}
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
                      priority
                      quality={500}
                      loading="eager"
                      unoptimized
                      layout="fill"
                      objectFit="cover"
                      objectPosition="center"
                      lazyBoundary="200px"
                      lazyRoot="200px"
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
                onClick={() => {
                  updateReport.mutate({ id: report._id, data: editedReport });
                  setIsEditing(false);
                }}
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
            <div className="flex gap-4 justify-between w-full">
              <div className="flex gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-2 ${
                    votes.upvotes > 0 ? "text-green-600" : ""
                  }`}
                  onClick={() => handleVote("upvote")}
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{votes.upvotes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-2 ${
                    votes.downvotes > 0 ? "text-red-600" : ""
                  }`}
                  onClick={() => handleVote("downvote")}
                >
                  <ThumbsDown className="h-4 w-4" />
                  <span>{votes.downvotes}</span>
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 "
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="h-4 w-4" />
                <span>{report?.comments?.length} Comments</span>
              </Button>
            </div>
          )}
        </div>

        {!isEditing && (
          <div className="border-t">
            {showComments && (
              <div className="mt-4 space-y-4 ">
                <div className="flex gap-3 space-y-3  bg-gray-50/50 rounded-xl p-3 border border-gray-100">
                  <Avatar className="h-8 w-8 ">
                    <Image
                      src={
                        report?.userId?.profileImage || "/anticrime-logo.png"
                      }
                      alt="Current user"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="text-sm min-h-[60px]"
                    />

                    {commentImages.length > 0 && (
                      <div className="grid grid-cols-10 gap-2 w-full mt-2">
                        {commentImages.map((image, index) => (
                          <div
                            key={index}
                            className="relative group max-w-20 aspect-square"
                          >
                            <div className="w-full h-full rounded-lg border border-border p-1 flex items-center justify-center relative overflow-hidden">
                              <img
                                src={URL.createObjectURL(image)}
                                alt={`Comment image ${index + 1}`}
                                className="object-cover w-full h-full rounded-lg transition-transform duration-200 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                              <button
                                type="button"
                                onClick={() => removeCommentImage(index)}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center  justify-between mt-4 ">
                      <div className="flex gap-2">
                        <label className="cursor-pointer hover:text-primary transition-colors">
                          <ImagePlus className="w-5 h-5" />
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleCommentFileUpload}
                          />
                        </label>
                      </div>

                      <Button
                        size="sm"
                        onClick={handleCommentSubmit}
                        disabled={isUploading || !newComment}
                      >
                        {isUploading ? "Posting..." : "Post"}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {report?.comments &&
                    Array.isArray(report.comments) &&
                    report.comments.map((comment: Comment) => (
                      <CommentItem key={comment._id} comment={comment} />
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default CrimeReportCard;
