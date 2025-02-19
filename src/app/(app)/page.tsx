import { getAllReports, getRecentReports, getUser } from "@/actions/reports";
import ReportsList from "@/app/(app)/components/reports-list";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function HomePage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["reports"],
    queryFn: getAllReports,
  });
  await queryClient.prefetchQuery({
    queryKey: ["recent-reports"],
    queryFn: getRecentReports,
  });
  await queryClient.prefetchQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReportsList />
    </HydrationBoundary>
  );
}
