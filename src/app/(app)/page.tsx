import { getAllReports } from "@/actions/reports";
import ReportsList from "@/components/global/reports/reports-list";

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

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReportsList />
    </HydrationBoundary>
  );
}
