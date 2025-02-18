import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { User } from "./types";

interface VoteButtonsProps {
  initialUpvotes: number;
  initialDownvotes: number;
  initialUpvoters: User[];
  initialDownvoters: User[];
  currentUserId: string;
  onVote: (type: "upvote" | "downvote") => void;
}

export const VoteButtons = ({
  initialUpvotes,
  initialDownvotes,
  initialUpvoters,
  initialDownvoters,
  currentUserId,
  onVote,
}: VoteButtonsProps) => {
  const [votes, setVotes] = useState({
    upvotes: initialUpvotes,
    downvotes: initialDownvotes,
    hasUpvoted: initialUpvoters.map((vote) => vote._id).includes(currentUserId),
    hasDownvoted: initialDownvoters
      .map((vote) => vote._id)
      .includes(currentUserId),
  });

  const handleVote = (type: "upvote" | "downvote") => {
    onVote(type);

    setVotes((prev) => {
      if (type === "upvote") {
        if (prev.hasUpvoted) {
          return {
            ...prev,
            upvotes: prev.upvotes - 1,
            hasUpvoted: false,
          };
        } else {
          return {
            upvotes: prev.upvotes + 1,
            downvotes: prev.hasDownvoted ? prev.downvotes - 1 : prev.downvotes,
            hasUpvoted: true,
            hasDownvoted: false,
          };
        }
      } else {
        if (prev.hasDownvoted) {
          return {
            ...prev,
            downvotes: prev.downvotes - 1,
            hasDownvoted: false,
          };
        } else {
          return {
            downvotes: prev.downvotes + 1,
            upvotes: prev.hasUpvoted ? prev.upvotes - 1 : prev.upvotes,
            hasDownvoted: true,
            hasUpvoted: false,
          };
        }
      }
    });
  };

  return (
    <div className="flex gap-4">
      <Button
        variant="ghost"
        size="sm"
        className={`gap-2 ${
          votes.hasUpvoted ? "text-green-600 bg-green-50" : ""
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
          votes.hasDownvoted ? "text-red-600 bg-red-50" : ""
        }`}
        onClick={() => handleVote("downvote")}
      >
        <ThumbsDown className="h-4 w-4" />
        <span>{votes.downvotes}</span>
      </Button>
    </div>
  );
};
