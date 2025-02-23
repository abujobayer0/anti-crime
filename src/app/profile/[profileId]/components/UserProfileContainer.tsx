"use client";

import { useReports, useUserProfile } from "@/hooks";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Share2, UserPlus2 } from "lucide-react";
import Image from "next/image";
import { ReportsListView } from "@/app/(app)/components/reports-list/ReportsList.view";

const UserProfileContainer = ({ profileId }: { profileId: string }) => {
  const { data: user } = useUserProfile(profileId);
  const { getProfileReports } = useReports();
  const { data: reports, isLoading } = getProfileReports(profileId);

  const defaultProfileImage = "/anticrime-logo.png";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-[300px] md:h-[400px] w-full">
        <Image
          src={user?.profileImage || defaultProfileImage}
          alt="Cover"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-32 sm:-mt-16 pb-8">
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="relative -mt-24 md:-mt-32">
                <Avatar className="w-32 h-32 md:w-48 md:h-48 border-4 border-white">
                  <Image
                    src={user?.profileImage || defaultProfileImage}
                    alt={user?.name || "Profile"}
                    width={192}
                    height={192}
                    className="object-cover"
                  />
                </Avatar>
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                      {user?.name}
                    </h1>
                    <p className="text-muted-foreground">{user?.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button className="gap-2">
                      <UserPlus2 className="w-4 h-4" />
                      Follow
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="text-xl font-bold">
                      {user?.followers || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Followers
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold">
                      {user?.following || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Following
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold">
                      {reports?.data?.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Reports</div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground max-w-2xl">
                  {user?.bio}
                </p>
              </div>
            </div>
          </Card>

          <div className="mt-6">
            <Tabs defaultValue="reports" className="w-full">
              <TabsList className="w-full justify-start h-12 bg-white">
                <TabsTrigger value="reports" className="text-base">
                  Reports
                </TabsTrigger>
                <TabsTrigger value="photos" className="text-base">
                  Photos
                </TabsTrigger>
              </TabsList>

              <TabsContent value="reports" className="mt-6 space-y-4">
                <ReportsListView
                  reports={reports?.data}
                  isLoading={isLoading}
                  user={user}
                  onDelete={() => {}}
                  onUpdate={() => {}}
                  onVote={() => {}}
                />
              </TabsContent>

              <TabsContent value="photos">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Photos</h3>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileContainer;
