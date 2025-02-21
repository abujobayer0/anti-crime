"use server";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getProfileReports } from "@/actions/reports";
import UserProfileContainer from "./components/UserProfileContainer";

type ReportPageProps = {
  params: { profileId: string };
};

export default async function UserProfilePage({ params }: ReportPageProps) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["profile-reports", params.profileId],
    queryFn: () => getProfileReports(params.profileId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserProfileContainer profileId={params.profileId} />
    </HydrationBoundary>
  );
}
