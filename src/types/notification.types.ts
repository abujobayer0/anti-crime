import { User } from "@/components/global/crime-report-card/types";
import { Report } from "@/hooks";

export type NotificationType =
  | "upvote"
  | "downvote"
  | "comment"
  | "reply"
  | "follow";

export interface Notification {
  recipient: string;
  sender: User;
  type: NotificationType;
  title: string;
  isDeleted: boolean;
  message: string;
  relatedReport?: Report;
  relatedComment?: Comment;
  isRead: boolean;
  createdAt: Date;
  _id: string;
}
