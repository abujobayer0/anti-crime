import { uploadFileToImageBB } from "@/lib/utils";
import { useReports } from "./api/useReports";

const useComment = () => {
  const { deleteComment, updateComment, addComment } = useReports();

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment.mutateAsync(commentId);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };
  const handleEditSubmit = async (commentId: string, editedComment: string) => {
    try {
      await updateComment.mutateAsync({
        id: commentId,
        data: {
          description: editedComment,
        },
      });
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };
  const handleReplySubmit = async (
    replyImages: File[],
    newReply: string,
    reportId: string,
    commentId: string
  ) => {
    const uploadedImageUrls = await Promise.all(
      replyImages.map(async (image) => {
        const imageUrl = await uploadFileToImageBB(image);
        return imageUrl;
      })
    );

    await addComment.mutateAsync({
      reportId: reportId,
      comment: {
        description: newReply,
        proofImage: uploadedImageUrls,
        replyTo: commentId,
      },
    });
  };

  return { handleDeleteComment, handleEditSubmit, handleReplySubmit };
};

export default useComment;
