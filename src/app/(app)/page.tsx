import { getAllReports } from "@/actions/reports";
import ReportsList from "@/components/global/reports/reports-list";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Metadata } from "next";

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

export const metadata: Metadata = {
  title: "Crime Reports Feed",
  description: "View and track recent crime reports from your community",
  openGraph: {
    title: "Crime Reports Feed | Anti Crime",
    description: "Stay informed about crime incidents in your area",
  },
};
