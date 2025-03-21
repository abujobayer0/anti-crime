import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatTimeAgo } from "@/lib/report";
import { EllipsisVertical, ImagePlus, Trash2, X, Edit2 } from "lucide-react";
import Image from "next/legacy/image";
import { useState } from "react";
import Link from "next/link";
import { User } from "@/types";
import { GlobalPopover } from "../global-popover";
import useComment from "@/hooks/useComment";
const CommentItem = ({
  comment,
  level = 0,
  sessionUser,
}: {
  comment: any;
  level?: number;
  sessionUser: User;
}) => {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [newReply, setNewReply] = useState<string>("");
  const [replyImages, setReplyImages] = useState<File[]>([]);
  const [isReplyUploading, setIsReplyUploading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.comment);

  const {
    handleDeleteComment,
    handleEditSubmit,
    handleReplySubmit: handleReplySubmitFn,
  } = useComment();

  const handleReplyFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setReplyImages((prev) => [...prev, ...Array.from(files)]);
  };

  const removeReplyImage = (index: number) => {
    setReplyImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReplySubmit = async () => {
    if (!newReply && replyImages.length === 0) return;
    setIsReplyUploading(true);
    try {
      await handleReplySubmitFn(
        replyImages,
        newReply,
        comment.reportId,
        comment._id
      );
      setReplyingTo(null);
      setNewReply("");
      setReplyImages([]);
    } catch (error) {
      console.error("Error submitting reply:", error);
    } finally {
      setIsReplyUploading(false);
    }
  };

  return (
    <div className="flex gap-3">
      <Link
        href={
          sessionUser?._id === comment.userId?._id
            ? "/profile"
            : `/profile/${comment.userId?._id}`
        }
      >
        <Avatar className="h-8 w-8 hover:opacity-80 shrink-0">
          <AvatarImage
            src={comment.userId?.profileImage || "/anticrime-logo.png"}
            alt={comment.userId?.name || "User"}
            width={32}
            height={32}
            className="rounded-full"
          />
        </Avatar>
      </Link>
      <div className="flex-1 space-y-2">
        <div className=" w-fit bg-gray-50 rounded-2xl px-4 py-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Link
              href={
                sessionUser?._id === comment.userId?._id
                  ? "/profile"
                  : `/profile/${comment.userId?._id}`
              }
            >
              <p className="font-semibold hover:underline text-sm">
                {comment.userId?.name}
              </p>
            </Link>
            {comment.userId?._id === sessionUser?._id && (
              <GlobalPopover
                align="end"
                action={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 -mr-2 hover:bg-gray-100"
                  >
                    <EllipsisVertical className="h-4 w-4" />
                  </Button>
                }
                content={
                  <>
                    <Button
                      variant="ghost"
                      className="flex w-full justify-start text-sm gap-2"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit2 size={16} /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      className="flex w-full justify-start text-sm gap-2"
                      onClick={async () =>
                        await handleDeleteComment(comment._id)
                      }
                    >
                      <Trash2 size={16} /> Delete
                    </Button>
                  </>
                }
              />
            )}
          </div>
          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                value={editedComment}
                onChange={(e) => setEditedComment(e.target.value)}
                className="text-sm min-h-[60px] bg-white border-gray-200 focus:border-primary/30 focus:ring-primary/20"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  size="sm"
                  onClick={async () => {
                    await handleEditSubmit(comment._id, editedComment);
                    setIsEditing(false);
                  }}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedComment(comment.comment);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm leading-relaxed break-words">
              {comment.comment}
            </p>
          )}
          {comment.proofImage && comment.proofImage.length > 0 && (
            <div className="grid grid-cols-2 gap-2 pt-2">
              {comment.proofImage.map((image: string, index: number) => (
                <Image
                  key={`${comment._id}-image-${index}`}
                  src={image || ""}
                  alt="Evidence"
                  priority
                  loading="eager"
                  unoptimized
                  width={300}
                  height={300}
                  className="rounded-lg w-full object-cover"
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4 text-sm items-center text-muted-foreground px-2">
          <span className="text-xs text-muted-foreground hover:underline cursor-pointer">
            {formatTimeAgo(new Date(comment.createdAt))}
          </span>
          {level < 2 && (
            <button
              className="hover:text-primary font-medium hover:underline"
              onClick={() => setReplyingTo(comment._id)}
            >
              Reply
            </button>
          )}
        </div>

        {replyingTo === comment._id && (
          <div className="mt-4 space-y-3 bg-gray-50/50 rounded-xl p-3 border border-gray-100">
            <Textarea
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder="Write a reply..."
              className="text-sm min-h-[60px] bg-white border-gray-200 focus:border-primary/30 focus:ring-primary/20"
            />

            {replyImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {replyImages.map((image, index) => (
                  <div key={index} className="relative group aspect-square">
                    <div className="w-full h-full rounded-lg border border-border p-1 flex items-center justify-center relative overflow-hidden">
                      <Image
                        src={URL.createObjectURL(image) || ""}
                        alt={`Reply image ${index + 1}`}
                        layout="fill"
                        unoptimized
                        priority
                        className="object-cover w-full h-full rounded-lg transition-transform duration-200 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removeReplyImage(index)}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="cursor-pointer hover:text-primary transition-colors">
                <ImagePlus className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleReplyFileUpload}
                />
              </label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleReplySubmit}
                  disabled={isReplyUploading}
                >
                  {isReplyUploading ? "Posting..." : "Reply"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setReplyingTo(null);
                    setNewReply("");
                    setReplyImages([]);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {comment.replyTo && comment.replyTo.length > 0 && (
          <div className="mt-4 space-y-4 ml-8 relative before:absolute before:left-[-16px] before:top-0 before:h-full before:w-[2px] before:bg-gray-100">
            {comment.replyTo.map((reply: any) => (
              <CommentItem
                key={reply._id}
                comment={reply}
                level={level + 1}
                sessionUser={sessionUser}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default CommentItem;
