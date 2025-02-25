import {
  Bell,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  UserPlus,
} from "lucide-react";

export const getNotificationIcon = (type: string) => {
  switch (type) {
    case "upvote":
      return <ThumbsUp className="w-4 h-4 text-green-500" />;
    case "downvote":
      return <ThumbsDown className="w-4 h-4 text-red-500" />;
    case "comment":
      return <MessageCircle className="w-4 h-4 text-blue-500" />;
    case "reply":
      return <MessageCircle className="w-4 h-4 text-blue-500" />;
    case "follow":
      return <UserPlus className="w-4 h-4 text-orange-500" />;
    default:
      return <Bell className="w-4 h-4 text-blue-500" />;
  }
};
