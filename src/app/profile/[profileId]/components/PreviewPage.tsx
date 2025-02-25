"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { Report, User } from "@/types";
import { ProfileImage } from "@/app/profile/components/ProfileImage";
import { ProfileInfo } from "@/app/profile/components/ProfileInfo";

import Image from "next/image";
import ReportCard from "@/app/profile/components/ReportCard";
import ProfilePageSkeleton from "../../components/profile-page-skeleton";
import { FollowButton } from "@/components/ui/follow-button";
import EmptyState from "../../components/EmptyState";
interface PreviewPageProps {
  user: User;
  reports: { data: Report[] };
  loading: boolean;
  followStatus: { data: { isFollowing: boolean } };
  follow: () => void;
  unfollow: () => void;
}
const PreviewPage = ({
  user,
  reports,
  loading,
  followStatus,
  follow,
  unfollow,
}: PreviewPageProps) => {
  if (loading) return <ProfilePageSkeleton />;
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="relative w-full h-[300px] lg:h-[400px]">
        <Image
          src={user?.coverImage || "/anticrime-logo.png"}
          alt="Cover"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-background" />
      </div>

      <div className="container max-w-7xl mx-auto px-4">
        <div className="relative -mt-24 mb-8 flex flex-col lg:flex-row gap-8">
          <div className="flex flex-col items-center lg:items-start">
            <div className="relative">
              <ProfileImage
                profileImage={user.profileImage || ""}
                isEditing={false}
                imgUploading={false}
                onImageUpload={() => {}}
                size="xl"
              />
              {user.isVerified && (
                <div className="absolute -right-2 -bottom-2 bg-primary rounded-full p-1.5">
                  <div className="bg-white rounded-full p-0.5">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <ProfileInfo profileData={user} />
              <FollowButton
                isFollowing={followStatus?.data.isFollowing}
                onFollow={follow}
                onUnfollow={unfollow}
              />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-card/50 backdrop-blur-xl p-6 rounded-2xl border border-border/10">
            <div className="space-y-1">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {user.name}'s Reports
              </h3>
              <p className="text-muted-foreground">
                View submitted crime reports
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium px-4 py-1.5 bg-primary/10 rounded-full">
                {reports?.data?.length} Reports
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 w-full md:grid-cols-2 gap-6">
            {reports?.data?.filter((report: Report) => !report.isDeleted)
              ?.length > 0 ? (
              reports?.data
                ?.filter((report: Report) => !report.isDeleted)
                .map((report: Report) => (
                  <ReportCard
                    key={report._id}
                    isPreview={true}
                    report={report}
                  />
                ))
            ) : (
              <div className="col-span-full">
                <EmptyState
                  icon={<AlertCircle className="w-12 h-12" />}
                  title="No Active Reports"
                  description={`${user.name} hasn't submitted any crime reports yet.`}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;
