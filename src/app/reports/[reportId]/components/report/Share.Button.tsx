import React, { useState, useCallback } from "react";
import { Share2, Facebook, Twitter, Linkedin, Link } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ShareButtonProps {
  url?: string;
  title?: string;
}

const SOCIAL_PLATFORMS = {
  FACEBOOK: "facebook",
  TWITTER: "twitter",
  LINKEDIN: "linkedin",
} as const;

const createShareLinks = (url: string, title: string) => ({
  [SOCIAL_PLATFORMS.FACEBOOK]: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    url
  )}`,
  [SOCIAL_PLATFORMS.TWITTER]: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    url
  )}&text=${encodeURIComponent(title)}`,
  [SOCIAL_PLATFORMS.LINKEDIN]: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    url
  )}`,
});

const SocialButton = ({
  platform,
  href,
  icon: Icon,
  bgColor,
  hoverColor,
}: {
  platform: string;
  href: string;
  icon: React.ElementType;
  bgColor: string;
  hoverColor: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`Share on ${platform}`}
    className={`${bgColor} ${hoverColor} p-2 rounded-full text-white flex items-center justify-center`}
  >
    <Icon size={18} />
  </a>
);

const ShareButton: React.FC<ShareButtonProps> = ({
  url = typeof window !== "undefined" ? window.location.href : "",
  title = "Report incident on Anti-Crime platform",
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const shareLinks = createShareLinks(url, title);

  const handleNativeShare = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.share) {
      toast.warning("Native sharing not supported", {
        description: "Your browser doesn't support the Web Share API.",
      });
      return;
    }

    try {
      await navigator.share({
        title,
        url,
      });
      toast.success("Shared successfully!");
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Share error:", error);
      }
    }
  }, [url, title]);

  const copyToClipboard = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      toast.error("Clipboard access not available");
      return;
    }

    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true);
        toast.success("Link copied!");
        const timeoutId = setTimeout(() => setCopied(false), 2000);
        return () => clearTimeout(timeoutId); // Cleanup
      })
      .catch((error) => {
        toast.error("Failed to copy link");
        if (process.env.NODE_ENV === "development") {
          console.error("Clipboard error:", error);
        }
      });
  }, [url]);

  const socialPlatforms = [
    {
      platform: SOCIAL_PLATFORMS.FACEBOOK,
      href: shareLinks[SOCIAL_PLATFORMS.FACEBOOK],
      icon: Facebook,
      bgColor: "bg-blue-600",
      hoverColor: "hover:bg-blue-700",
    },
    {
      platform: SOCIAL_PLATFORMS.TWITTER,
      href: shareLinks[SOCIAL_PLATFORMS.TWITTER],
      icon: Twitter,
      bgColor: "bg-black",
      hoverColor: "hover:bg-gray-800",
    },
    {
      platform: SOCIAL_PLATFORMS.LINKEDIN,
      href: shareLinks[SOCIAL_PLATFORMS.LINKEDIN],
      icon: Linkedin,
      bgColor: "bg-blue-700",
      hoverColor: "hover:bg-blue-800",
    },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-colors"
          aria-label="Share content"
        >
          <Share2 size={18} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="flex flex-col space-y-2">
          <h3 className="font-medium mb-2">Share via</h3>

          <Button
            variant="outline"
            className="flex items-center justify-start"
            onClick={handleNativeShare}
            aria-label="Use native share functionality"
          >
            <Share2 className="mr-2 h-4 w-4" />
            <span>Share</span>
          </Button>

          <div className="grid grid-cols-4 gap-2">
            {socialPlatforms.map((platform) => (
              <SocialButton key={platform.platform} {...platform} />
            ))}

            <button
              onClick={copyToClipboard}
              aria-label="Copy link to clipboard"
              className="bg-gray-600 hover:bg-gray-700 p-2 rounded-full text-white flex items-center justify-center"
            >
              <Link size={18} />
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ShareButton;
