"use client";
import { useState } from "react";
import { useReports } from "@/hooks/api/useReports";
import { uploadFileToImageBB } from "@/lib/utils";

import { CommentsSectionView } from "./CommentsSection.view";
import { Comment } from "../crime-report-card/types";

interface Props {
  comments: Comment[];
  reportId: string;
  userImage?: string;
  open?: boolean;
}

export const CommentsSectionContainer = ({
  comments,
  reportId,
  userImage = "/anticrime-logo.png",
  open = false,
}: Props) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentImages, setCommentImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { addComment } = useReports();

  const handleCommentSubmit = async () => {
    if (!newComment && commentImages.length === 0) return;
    setIsUploading(true);

    try {
      const uploadedImages = await Promise.all(
        commentImages.map((image) => uploadFileToImageBB(image))
      );

      await addComment.mutateAsync({
        reportId,
        comment: {
          description: newComment,
          proofImage: uploadedImages,
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setCommentImages([...commentImages, ...Array.from(files)]);
  };

  const removeImage = (index: number) => {
    setCommentImages(commentImages.filter((_, i) => i !== index));
  };

  return (
    <CommentsSectionView
      comments={comments}
      showComments={!open ? showComments : true}
      newComment={newComment}
      commentImages={commentImages}
      isUploading={isUploading}
      userImage={userImage}
      onToggleComments={() => setShowComments(!showComments)}
      onCommentChange={setNewComment}
      onCommentSubmit={handleCommentSubmit}
      onFileUpload={handleFileUpload}
      onRemoveImage={removeImage}
    />
  );
};
