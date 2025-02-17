"use client";

import {
  LocateIcon,
  TimerIcon,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  X,
  ImagePlus,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useReports } from "@/hooks/api/useReports";
import { Avatar } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

import { useParams } from "next/navigation";
import { uploadFileToImageBB } from "@/lib/utils";
import CommentItem from "@/components/global/comments-items";

const ReportDetailsPage = () => {
  const params = useParams();
  const { getReport, addEvidence } = useReports();
  const [newComment, setNewComment] = useState<string>("");
  const [commentImages, setCommentImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);

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

      await addEvidence.mutateAsync({
        reportId: params.reportId as string,
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
          </div>
        </div>

        <div className="w-full max-w-xl space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Evidence & Comments
            </h3>

            <div className="space-y-6">
              <div className="flex gap-3 space-y-3 bg-gray-50/50 rounded-xl p-3 border border-gray-100">
                <Avatar className="h-8 w-8">
                  <Image
                    src={report?.userId?.profileImage || "/anticrime-logo.png"}
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
                    placeholder="Add evidence or comment..."
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

                  <div className="flex items-center justify-between mt-4">
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

              <div className="space-y-6">
                {report?.comments.map((comment: any) => (
                  <CommentItem key={comment._id} comment={comment} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailsPage;
