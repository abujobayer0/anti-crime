"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Edit2,
  MapPin,
  Phone,
  Mail,
  Shield,
  AlertCircle,
  Check,
  MessageSquare,
  Video,
  Circle,
  Loader2,
} from "lucide-react";

import { useUser } from "@/hooks/api/useUser";
import { useProfile } from "@/hooks/api/useProfile";
import { uploadFileToImageBB } from "@/lib/utils";
import Link from "next/link";

const ProfilePage = () => {
  const { data: userData, isLoading } = useUser({ reports: true });
  const { updateProfile, verifyOTP, sendOTP } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [imgUploading, setImgUploading] = useState(false);
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

  // Add a useEffect to update profile data after mounting
  useEffect(() => {
    if (userData?.user) {
      setProfileData((prev) => ({
        ...prev,
        name: userData.user.name || "",
        email: userData.user.email || "",
        phone: userData.user.contact || "",
        isVerified: userData.user.isVerified,
        profileImage: userData.user.profileImage || "",
        bio: userData.user.bio || "",
        role: userData.user.role || "",
        reports: userData.userReports || [],
        _id: userData.user._id,
      }));
    }
  }, [userData?.user]);

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

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} days ago`;
    if (hours > 0) return `${hours} hours ago`;
    return `${minutes} minutes ago`;
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Profile Information */}
        <div className="lg:w-1/3 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <Image
                src={profileData.profileImage}
                alt="Profile"
                fill
                priority
                className="rounded-full object-cover"
              />
              {imgUploading && (
                <div className="absolute bg-white/25 backdrop-blur-md rounded-full top-0 left-0 w-full h-full flex items-center justify-center">
                  <Loader2 className="w-6 text-white h-6 animate-spin" />
                </div>
              )}
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer">
                  <Edit2 className="w-4 h-4" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <Input
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                  placeholder="Name"
                />
                <Input
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  placeholder="Email"
                  type="email"
                  disabled
                />
                <Input
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData({ ...profileData, phone: e.target.value })
                  }
                  placeholder="Phone"
                  type="tel"
                />
                <Textarea
                  value={profileData.bio}
                  onChange={(e) =>
                    setProfileData({ ...profileData, bio: e.target.value })
                  }
                  placeholder="Bio"
                  className="resize-none"
                />
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={imgUploading}
                    className="flex-1"
                  >
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-center">
                  {profileData.name}
                </h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{profileData.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{profileData.phone}</span>
                  </div>
                  {profileData.role === "admin" && (
                    <div className="flex items-center gap-2 text-primary">
                      <Shield className="w-4 h-4" />
                      <span>Admin</span>
                    </div>
                  )}
                  {!profileData.isVerified && (
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertCircle className="w-4 h-4" />
                      <span>Unverified Account</span>
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="w-full"
                >
                  Edit Profile
                </Button>
              </div>
            )}

            {!isEditing && !profileData.isVerified && (
              <div className="mt-4">
                {!isVerifying ? (
                  <Button
                    onClick={handleSendOTP}
                    variant="default"
                    className="w-full"
                  >
                    Verify Phone Number
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <Input
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                      type="text"
                      maxLength={6}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleVerifyOTP(otp)}
                        variant="default"
                        className="flex-1"
                      >
                        Verify OTP
                      </Button>
                      <Button
                        onClick={() => {
                          setIsVerifying(false);
                          setOtpSent(false);
                          setOtp("");
                        }}
                        variant="outline"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                    {otpSent && (
                      <Button
                        onClick={handleSendOTP}
                        variant="link"
                        className="w-full"
                      >
                        Resend OTP
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Updated User's Crime Reports Section */}
        <div className="lg:w-2/3 space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold">My Crime Reports</h3>
            <div className="flex gap-2 items-center">
              <span className="text-sm text-muted-foreground px-3 py-1 bg-gray-100 rounded-full">
                Total Reports: {profileData.reports?.length}
              </span>
            </div>
          </div>

          {profileData.reports?.length > 0 ? (
            <div className="grid gap-6">
              {profileData.reports?.map((report: any) => (
                <div
                  key={report._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100"
                >
                  <div className="p-6">
                    {/* Header Section */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="space-y-2">
                        <h4 className="text-xl font-semibold text-gray-900 hover:text-primary transition-colors">
                          {report.title}
                        </h4>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>
                              {report.district}, {report.division}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="inline-block px-2 py-1 bg-gray-100 rounded-full text-xs">
                              ID: {report._id}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {report.isDeleted ? (
                          <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs">
                            Deleted
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs">
                            Active
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Media Section */}
                    <div className="flex gap-4 mb-6">
                      {report.images && report.images.length > 0 && (
                        <div className="flex gap-2">
                          {report.images
                            .slice(0, 2)
                            .map((image: string, index: number) => (
                              <div
                                key={index}
                                className="relative w-32 h-32 rounded-lg overflow-hidden"
                              >
                                <Image
                                  src={image}
                                  alt={`Crime Report Image ${index + 1}`}
                                  fill
                                  className="object-cover hover:scale-105 transition-transform"
                                />
                              </div>
                            ))}
                          {report.images.length > 2 && (
                            <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                              <span className="text-lg font-semibold text-gray-600">
                                +{report.images.length - 2}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      {report.video && (
                        <div className="relative w-64 h-32 rounded-lg overflow-hidden">
                          <video
                            src={report.video}
                            controls
                            className="w-full h-full object-cover"
                            poster="/video-thumbnail.png"
                          >
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      )}
                    </div>

                    {/* Description Section */}
                    <div className="mb-6">
                      <p className="text-gray-700 leading-relaxed">
                        {report.description}
                      </p>
                    </div>

                    {/* Time Information */}
                    <div className="flex flex-wrap gap-6 items-center text-sm text-muted-foreground mb-6 pb-6 border-b">
                      <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-full">
                        <span className="font-medium">Posted:</span>
                        {formatTimeAgo(new Date(report.postTime))}
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-full">
                        <span className="font-medium">Crime Time:</span>
                        {new Date(report.crimeTime).toLocaleString()}
                      </div>
                    </div>

                    {/* Engagement Stats */}
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-sm px-3 py-1 bg-green-50 text-green-600 rounded-full">
                        <span className="font-medium">
                          {report.upvotes.length}
                        </span>
                        <span>upvotes</span>
                      </div>
                      <Link
                        href={`/reports/${report._id}`}
                        className="gap-2 flex items-center p-2 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span className="font-medium">
                          {report.comments.length}
                        </span>
                        <span className="text-muted-foreground">comments</span>
                      </Link>
                      {report.video && (
                        <div className="flex items-center gap-2 text-sm px-3 py-1 bg-gray-50 rounded-full">
                          <Video className="w-4 h-4" />
                          <span className="text-muted-foreground">
                            Video Available
                          </span>
                        </div>
                      )}
                      {report.downvotes.length > 0 && (
                        <div className="flex items-center gap-2 text-sm px-3 py-1 bg-red-50 text-red-600 rounded-full">
                          <span className="font-medium">
                            {report.downvotes.length}
                          </span>
                          <span>downvotes</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
