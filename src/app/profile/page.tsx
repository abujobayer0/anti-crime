"use client";

import React, { useState, useEffect } from "react";

import { AlertCircle } from "lucide-react";

import { useUser } from "@/hooks/api/useUser";
import { useProfile } from "@/hooks/api/useProfile";
import { uploadFileToImageBB } from "@/lib/utils";

import { VerificationSection } from "./components/VerificationSection";
import { ProfileImage } from "./components/ProfileImage";
import { ProfileForm } from "./components/ProfileForm";
import { ProfileInfo } from "./components/ProfileInfo";

import Reports from "./components/Reports";
import ProfilePageSkeleton from "@/components/global/skeletons/profile-page-skeleton";
import { useReports } from "@/hooks";

const ProfilePage = () => {
  const { data: userData, isLoading } = useUser();
  const { updateProfile, verifyOTP, sendOTP } = useProfile();
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
    sendOTP.mutate(userData?.phone);
  };

  const handleVerifyOTP = (otp: string) => {
    verifyOTP.mutate({ phone: userData?.phone, otp });
  };

  if (isLoading || reportsLoading)
    return (
      <ProfilePageSkeleton
        loading={isLoading}
        reportsLoading={reportsLoading}
      />
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col  lg:flex-row gap-8">
        <div className="lg:w-1/3  space-y-6">
          <div className="bg-card sticky top-16 border border-border/10 rounded-xl shadow-sm p-6">
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
          <div className="flex justify-between sticky top-16 !z-10 backdrop-blur-md items-center bg-white/25 p-4 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold">My Crime Reports</h3>
            <div className="flex gap-2 items-center">
              <span className="text-sm text-muted-foreground px-3 py-1 bg-gray-100 rounded-full">
                Total Reports: {profileData.reports?.length}
              </span>
            </div>
          </div>

          {profileData.reports?.length > 0 ? (
            <Reports reports={profileData.reports} />
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="max-w-md mx-auto space-y-4">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto" />
                <h4 className="text-xl font-semibold">No Crime Reports Yet</h4>
                <p className="text-muted-foreground">
                  You haven't submitted any crime reports. When you do, they
                  will appear here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
