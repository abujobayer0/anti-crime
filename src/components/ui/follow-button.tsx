"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus2, UserMinus2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
  isFollowing?: boolean;
  onFollow?: () => void;
  onUnfollow?: () => void;
  className?: string;
}

export function FollowButton({
  isFollowing = false,
  onFollow,
  onUnfollow,
  className,
}: FollowButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    setFollowing(isFollowing);
  }, [isFollowing]);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsPending(true);
      if (following) {
        onUnfollow?.();
      } else {
        onFollow?.();
      }

      setFollowing(!following);
    } catch (error) {
      console.error("Failed to update follow status:", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isPending}
      variant={following ? "outline" : "default"}
      className={cn(
        "gap-2 transition-all duration-300",
        following && "hover:bg-destructive hover:text-destructive-foreground",
        className
      )}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : following ? (
        <UserMinus2 className="h-4 w-4" />
      ) : (
        <UserPlus2 className="h-4 w-4" />
      )}
      <span>{following ? "Following" : "Follow"}</span>
    </Button>
  );
}
