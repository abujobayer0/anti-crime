"use client";

import { useReports, useUserProfile } from "@/hooks";
import PreviewPage from "./PreviewPage";
import { useFollowers } from "@/hooks/api/useFollowers";

const UserProfileContainer = ({ profileId }: { profileId: string }) => {
  const { data: user, isLoading: userLoading } = useUserProfile(profileId);
  const { getProfileReports } = useReports();
  const { data: reports, isLoading: reportsLoading } =
    getProfileReports(profileId);

  const { checkFollowStatus, follow, unfollow } = useFollowers();
  const { data: followStatus, isLoading: followStatusLoading } =
    checkFollowStatus(profileId);

  return (
    <PreviewPage
      user={user}
      reports={reports}
      loading={userLoading || reportsLoading || followStatusLoading}
      followStatus={followStatus}
      follow={() => follow.mutate(profileId)}
      unfollow={() => unfollow.mutate(profileId)}
    />
  );
};

export default UserProfileContainer;
