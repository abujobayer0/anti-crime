import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import RecentReports from "./RecentReports";
import { getRecentReports } from "@/actions/reports";

export default async function RecentReportsLayout() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["recent-reports"],
    queryFn: getRecentReports,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RecentReports />
    </HydrationBoundary>
  );
}
