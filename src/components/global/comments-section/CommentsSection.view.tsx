import Image from "next/legacy/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { MessageCircle, ImagePlus, X } from "lucide-react";
import CommentItem from "../comments-items";
import { Comment } from "../crime-report-card/types";

interface ViewProps {
  comments: Comment[];
  showComments: boolean;
  newComment: string;
  commentImages: File[];
  isUploading: boolean;
  userImage: string;
  onToggleComments: () => void;
  onCommentChange: (value: string) => void;
  onCommentSubmit: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
}

export const CommentsSectionView = ({
  comments,
  showComments,
  newComment,
  commentImages,
  isUploading,
  userImage,
  onToggleComments,
  onCommentChange,
  onCommentSubmit,
  onFileUpload,
  onRemoveImage,
}: ViewProps) => {
  return (
    <div className="border-t mt-4 pt-4">
      <Button
        variant="ghost"
        size="sm"
        className="gap-2"
        onClick={onToggleComments}
      >
        <MessageCircle className="h-4 w-4" />
        <span>{comments?.length} Comments</span>
      </Button>

      {showComments && (
        <div className="mt-4 space-y-4">
          <div className="flex gap-3 space-y-3 bg-gray-50/50 rounded-xl p-3 border border-gray-100">
            <Avatar className="h-8 w-8">
              <Image
                src={userImage || ""}
                alt="Current user"
                width={32}
                height={32}
                className="rounded-full"
              />
            </Avatar>
            <div className="flex-1">
              <Textarea
                value={newComment}
                onChange={(e) => onCommentChange(e.target.value)}
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
                        <Image
                          src={URL.createObjectURL(image) || ""}
                          alt={`Comment image ${index + 1}`}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full rounded-lg transition-transform duration-200 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                        <button
                          type="button"
                          onClick={() => onRemoveImage(index)}
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
                    onChange={onFileUpload}
                  />
                </label>

                <Button
                  size="sm"
                  onClick={onCommentSubmit}
                  disabled={isUploading || !newComment}
                >
                  {isUploading ? "Posting..." : "Post"}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {comments?.map((comment) => (
              <CommentItem key={comment._id} comment={comment} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
