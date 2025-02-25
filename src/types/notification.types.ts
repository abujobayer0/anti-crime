export type NotificationType =
  | "upvote"
  | "downvote"
  | "comment"
  | "reply"
  | "follow";

export interface Notification {
  recipient: string;
  sender: {
    profileImage: string;
    username: string;
  };
  type: NotificationType;
  title: string;
  isDeleted: boolean;
  message: string;
  relatedReport?: string;
  relatedComment?: string;
  isRead: boolean;
  createdAt: Date;
  _id: string;
}
