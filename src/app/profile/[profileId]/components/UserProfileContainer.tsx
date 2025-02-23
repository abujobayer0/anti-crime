"use client";

import { useReports, useUserProfile } from "@/hooks";
import PreviewPage from "./PreviewPage";
const UserProfileContainer = ({ profileId }: { profileId: string }) => {
  const { data: user, isLoading: userLoading } = useUserProfile(profileId);
  const { getProfileReports } = useReports();
  const { data: reports, isLoading: reportsLoading } =
    getProfileReports(profileId);

  return (
    <PreviewPage
      user={user}
      reports={reports}
      loading={userLoading || reportsLoading}
    />
  );
};

export default UserProfileContainer;
