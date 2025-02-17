import { getAllReports } from "@/actions/reports";
import ReportsList from "@/components/global/reports/reports-list";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

interface RecentActivity {
  id: string;
  type: "report" | "alert" | "update";
  title: string;
  location: string;
  timestamp: Date;
  description: string;
}

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
