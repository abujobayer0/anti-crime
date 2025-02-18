import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit2, Mail, Phone, Shield, AlertCircle, MapPin } from "lucide-react";

const ProfileImageSkeleton = () => (
  <div className="relative w-32 h-32 mx-auto mb-4">
    <Skeleton className="w-full h-full rounded-full" />
    <div className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full">
      <Edit2 className="w-4 h-4" />
    </div>
  </div>
);

const ProfileInfoSkeleton = () => (
  <div className="space-y-4 w-full">
    <Skeleton className="w-48 h-6 mx-auto" />
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Mail className="w-4 h-4 text-muted-foreground" />
        <Skeleton className="w-40 h-4" />
      </div>
      <div className="flex items-center gap-2">
        <Phone className="w-4 h-4 text-muted-foreground" />
        <Skeleton className="w-32 h-4" />
      </div>
      <div className="flex items-center gap-2 text-primary">
        <Shield className="w-4 h-4" />
        <Skeleton className="w-20 h-4" />
      </div>
      <div className="flex items-center gap-2 text-destructive">
        <AlertCircle className="w-4 h-4" />
        <Skeleton className="w-24 h-4" />
      </div>
    </div>
    <Skeleton className="w-full h-10" />
  </div>
);

const ReportCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <Skeleton className="w-64 h-6 mb-4" />
    <div className="flex items-center gap-4 mb-4">
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-muted-foreground" />
        <Skeleton className="w-32 h-4" />
      </div>
      <Skeleton className="w-20 h-4 bg-gray-100 rounded-full" />
    </div>
    <div className="flex gap-4 mb-6">
      <Skeleton className="w-32 h-32 rounded-lg" />
      <Skeleton className="w-32 h-32 rounded-lg" />
    </div>
    <Skeleton className="w-full h-20 mb-6" />
    <div className="flex items-center gap-6">
      <Skeleton className="w-20 h-6 bg-green-50 rounded-full" />
      <Skeleton className="w-20 h-6 bg-blue-50 rounded-full" />
      <Skeleton className="w-20 h-6 bg-gray-50 rounded-full" />
    </div>
  </div>
);

const ReportsSkeleton = () => (
  <div className="grid w-full gap-6">
    {[...Array(3)].map((_, index) => (
      <ReportCardSkeleton key={index} />
    ))}
  </div>
);

const ProfilePageSkeleton = ({
  loading,
  reportsLoading,
}: {
  loading: boolean;
  reportsLoading: boolean;
}) => (
  <div className="container mx-auto px-4 py-8">
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="lg:w-1/2 space-y-6">
        {loading && (
          <div className="bg-white max-w-md w-full rounded-xl shadow-sm p-6">
            <ProfileImageSkeleton />
            <ProfileInfoSkeleton />
          </div>
        )}
      </div>
      {reportsLoading && <ReportsSkeleton />}
    </div>
  </div>
);

export default ProfilePageSkeleton;
