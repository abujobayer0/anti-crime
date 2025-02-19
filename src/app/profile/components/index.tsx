"use client";

import React, { useState, useEffect } from "react";
import { Activity, AlertCircle, Archive } from "lucide-react";
import { useUser } from "@/hooks/api/useUser";
import { useProfile } from "@/hooks/api/useProfile";
import { uploadFileToImageBB } from "@/lib/utils";

import { useReports } from "@/hooks";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { TabsList } from "@/components/ui/tabs";
import { Report } from "@/types";
import ProfilePageSkeleton from "./profile-page-skeleton";
import { ProfileImage } from "./ProfileImage";
import { ProfileForm } from "./ProfileForm";
import { ProfileInfo } from "./ProfileInfo";
import { VerificationSection } from "./VerificationSection";
import Reports from "./Reports";

const ProfilePage = () => {
  const { data: userData, isPending, isLoading } = useUser();
  const { updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [imgUploading, setImgUploading] = useState(false);
  const { getUserReports } = useReports();
  const { data: reports, isLoading: reportsLoading } = getUserReports;
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "I am a concerned citizen helping to make our community safer.",
    profileImage: "/anticrime-logo.png",
    isVerified: false,
    role: "",
    reports: [],
    _id: "",
  });

  const [isVerifying, setIsVerifying] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    if (userData || reports?.data) {
      setProfileData((prev) => ({
        ...prev,
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.contact || "",
        isVerified: userData.isVerified,
        profileImage: userData.profileImage || "",
        bio: userData.bio || "",
        reports: reports?.data || [],
        role: userData.role || "",
        _id: userData._id,
      }));
    }
  }, [userData, reports?.data]);

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateProfile.mutate(
      {
        name: profileData.name,
        contact: profileData.phone,
        bio: profileData.bio,
        profileImage: profileData.profileImage,
        id: profileData._id,
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

  const handleSendOTP = () => {
    // sendOTP.mutate(userData?.phone);
  };

  const handleVerifyOTP = (otp: string) => {
    console.log(otp);
    // verifyOTP.mutate({ phone: userData?.phone, otp });
  };

  if (isLoading || reportsLoading || isPending) return <ProfilePageSkeleton />;

  return (
    <div className=" mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3 space-y-6">
          <div className="bg-card backdrop-blur-lg sticky top-16 border border-border/5 rounded-2xl shadow-sm p-8 transition-all duration-200 hover:shadow-xl">
            <ProfileImage
              profileImage={profileData.profileImage}
              isEditing={isEditing}
              imgUploading={imgUploading}
              onImageUpload={handleImageUpload}
            />

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

            {!isEditing && !profileData.isVerified && (
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
            )}
          </div>
        </div>

        <div className="lg:w-2/3 space-y-6">
          <div className="flex justify-between sticky shadow-sm top-16 !z-10 backdrop-blur-xl items-center bg-white/10 p-6 rounded-2xl border border-border/5">
            <h3 className="text-2xl font-bold">My Crime Reports</h3>

            <div className="flex gap-2 items-center">
              <span className="text-sm font-medium px-4 py-2 bg-muted/30 rounded-full">
                Total Reports: {profileData.reports?.length}
              </span>
            </div>
          </div>
          <Tabs
            defaultValue="active"
            className="w-full flex flex-col justify-center items-end"
          >
            <TabsList className="grid w-[400px] grid-cols-2 p-1 bg-muted/30">
              <TabsTrigger
                value="active"
                className="transition-all duration-200"
              >
                <Activity className="w-4 h-4 mr-2" />
                Active
              </TabsTrigger>
              <TabsTrigger
                value="archived"
                className="transition-all duration-200"
              >
                <Archive className="w-4 h-4 mr-2" />
                Archived
              </TabsTrigger>
            </TabsList>
            <TabsContent value="active">
              {profileData?.reports?.filter(
                (report: Report) => !report.isDeleted
              )?.length > 0 ? (
                <Reports
                  reports={profileData.reports.filter(
                    (report: Report) => !report.isDeleted
                  )}
                />
              ) : (
                <div className=" w-full backdrop-blur-lg rounded-2xl  p-12 text-center border border-border/5">
                  <div className="mx-auto space-y-6">
                    <AlertCircle className="w-16 h-16 text-primary/60 mx-auto" />
                    <h4 className="text-2xl font-bold text-muted-foreground">
                      No Crime Reports Yet
                    </h4>
                    <p className="text-muted-foreground/80 text-lg">
                      You haven&apos;t submitted any crime reports. When you do,
                      they will appear here.
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="archived">
              {profileData?.reports?.filter(
                (report: Report) => report.isDeleted
              )?.length > 0 ? (
                <Reports
                  reports={profileData.reports.filter(
                    (report: Report) => report.isDeleted
                  )}
                />
              ) : (
                <div className="w-full backdrop-blur-lg rounded-2xl p-12 text-center border border-border/5">
                  <div className="mx-auto space-y-6">
                    <Archive className="w-16 h-16 text-primary/60 mx-auto" />
                    <h4 className="text-2xl font-bold text-muted-foreground">
                      No Archived Reports Yet
                    </h4>
                    <p className="text-muted-foreground/80 text-lg">
                      You haven&apos;t archived any crime reports. When you do,
                      they will appear here.
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
