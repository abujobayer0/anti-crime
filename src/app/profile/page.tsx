import { getUser, getUserReports } from "@/actions/reports";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import ProfilePage from "./components";

export default async function Page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });
  await queryClient.prefetchQuery({
    queryKey: ["user-reports"],
    queryFn: getUserReports,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfilePage />
    </HydrationBoundary>
  );
}
