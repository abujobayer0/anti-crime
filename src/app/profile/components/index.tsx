"use client";

import React, { useState, useEffect } from "react";
import { Activity, AlertCircle, Archive, Camera } from "lucide-react";
import { useUser } from "@/hooks/api/useUser";
import { useProfile } from "@/hooks/api/useProfile";
import { uploadFileToImageBB } from "@/lib/utils";
import { useReports } from "@/hooks";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { TabsList } from "@/components/ui/tabs";
import { Report } from "@/types";
import { ProfileImage } from "./ProfileImage";
import { ProfileForm } from "./ProfileForm";
import { ProfileInfo } from "./ProfileInfo";
import { VerificationSection } from "./VerificationSection";
import Image from "next/image";
import ReportCard from "./ReportCard";
import ProfilePageSkeleton from "./profile-page-skeleton";
import EmptyState from "./EmptyState";
const ProfilePage = () => {
  const { data: userData, isPending, isLoading } = useUser();
  const { updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const { updateReport } = useReports();
  const [imgUploading, setImgUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const { getUserReports } = useReports();
  const { data: reports, isLoading: reportsLoading } = getUserReports;
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "I am a concerned citizen helping to make our community safer.",
    profileImage: "/anticrime-logo.png",
    coverImage: "/anticrime-logo.png",
    isVerified: false,
    role: "",
    reports: [],
    _id: "",
  });

  const [isVerifying, setIsVerifying] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    if (isPending || isLoading) return;
    if (userData || reports?.data) {
      setProfileData((prev) => ({
        ...prev,
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.contact || "",
        isVerified: userData.isVerified,
        profileImage: userData.profileImage || "",
        coverImage: userData.coverImage || "",
        bio: userData.bio || "",
        reports: reports?.data || [],
        role: userData.role || "",
        _id: userData._id,
      }));
    }
  }, [userData, reports?.data, isLoading, isLoading]);

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateProfile.mutate(
      {
        name: profileData.name,
        contact: profileData.phone,
        bio: profileData.bio,
        profileImage: profileData.profileImage,
        id: profileData._id,
        coverImage: profileData.coverImage,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImgUploading(true);
      const url = await uploadFileToImageBB(file);
      setProfileData({ ...profileData, profileImage: url });
      setImgUploading(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverUploading(true);
      const url = await uploadFileToImageBB(file);
      setProfileData({ ...profileData, coverImage: url });
      setCoverUploading(false);
    }
  };

  const handleSendOTP = () => {
    // sendOTP.mutate(userData?.phone);
  };

  const handleVerifyOTP = (otp: string) => {
    console.log(otp);
    // verifyOTP.mutate({ phone: userData?.phone, otp });
  };

  if (reportsLoading || isLoading) return <ProfilePageSkeleton />;
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="relative w-full h-[300px] lg:h-[400px]">
        <Image
          src={profileData.coverImage}
          alt="Cover"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-background" />

        {isEditing && (
          <div className="absolute bottom-40 right-4 z-50">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverUpload}
                disabled={coverUploading}
              />
              <div className="bg-black/10 hover:bg-black/20 backdrop-blur-md text-white px-4 py-2 rounded-full transition-all">
                {coverUploading ? (
                  "Uploading..."
                ) : (
                  <span className="flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Change Cover
                  </span>
                )}
              </div>
            </label>
          </div>
        )}
      </div>

      <div className="container max-w-7xl mx-auto px-4">
        <div className="relative -mt-24 mb-8 flex flex-col lg:flex-row gap-8">
          <div className="flex flex-col items-center lg:items-start">
            <div className="relative">
              <ProfileImage
                profileImage={profileData.profileImage}
                isEditing={isEditing}
                imgUploading={imgUploading}
                onImageUpload={handleImageUpload}
                size="xl"
              />
              {profileData.isVerified && (
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
            {isEditing ? (
              <ProfileForm
                profileData={profileData}
                setProfileData={setProfileData}
                onSubmit={handleProfileUpdate}
                onCancel={() => setIsEditing(false)}
                imgUploading={imgUploading}
              />
            ) : (
              <ProfileInfo
                profileData={profileData}
                onEdit={() => setIsEditing(true)}
              />
            )}
          </div>
        </div>

        {!isEditing && !profileData.isVerified && (
          <div className="mb-8">
            <VerificationSection
              isVerifying={isVerifying}
              otp={otp}
              otpSent={otpSent}
              onOtpChange={(value) => setOtp(value)}
              onVerifyOTP={() => handleVerifyOTP(otp)}
              onSendOTP={handleSendOTP}
              onCancel={() => {
                setIsVerifying(false);
                setOtpSent(false);
                setOtp("");
              }}
            />
          </div>
        )}

        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-card/50 backdrop-blur-xl p-6 rounded-2xl border border-border/10">
            <div className="space-y-1">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Crime Reports
              </h3>
              <p className="text-muted-foreground">
                Manage and track your submitted reports
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium px-4 py-1.5 bg-primary/10 rounded-full">
                {profileData.reports?.length} Reports
              </span>
            </div>
          </div>

          <Tabs defaultValue="active" className="w-full">
            <TabsList className="w-full sm:w-[400px] grid grid-cols-2 p-1 bg-card/50 rounded-full">
              <TabsTrigger
                value="active"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full transition-all duration-300"
              >
                <Activity className="w-4 h-4 mr-2" />
                Active Reports
              </TabsTrigger>
              <TabsTrigger
                value="archived"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full transition-all duration-300"
              >
                <Archive className="w-4 h-4 mr-2" />
                Archived
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-6">
              <div className="grid grid-cols-1 w-full md:grid-cols-2 gap-6">
                {profileData?.reports?.filter(
                  (report: Report) => !report.isDeleted
                )?.length > 0 ? (
                  profileData.reports
                    .filter((report: Report) => !report.isDeleted)
                    .map((report: Report) => (
                      <ReportCard
                        key={report._id}
                        report={report}
                        onUpdate={updateReport.mutate}
                        isPreview={false}
                      />
                    ))
                ) : (
                  <div className="col-span-full">
                    <EmptyState
                      icon={<AlertCircle className="w-12 h-12" />}
                      title="No Active Reports"
                      description="You haven't submitted any crime reports yet. When you do, they will appear here."
                    />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="archived" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profileData?.reports?.filter(
                  (report: Report) => report.isDeleted
                )?.length > 0 ? (
                  profileData.reports
                    .filter((report: Report) => report.isDeleted)
                    .map((report: Report) => (
                      <ReportCard
                        key={report._id}
                        onUpdate={updateReport.mutate}
                        report={report}
                        isPreview={false}
                      />
                    ))
                ) : (
                  <div className="col-span-full">
                    <EmptyState
                      icon={<Archive className="w-12 h-12" />}
                      title="No Archived Reports"
                      description="You haven't archived any reports yet. Archived reports will appear here."
                    />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
