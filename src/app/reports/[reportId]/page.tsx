import { getReportById } from "@/actions/reports";
import ReportDetailsContainer from "@/app/reports/[reportId]/components";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Metadata } from "next";

export default async function ReportPage({
  params,
}: {
  params: { reportId: string };
}) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["reports", params.reportId],
    queryFn: () => getReportById(params.reportId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReportDetailsContainer reportId={params.reportId} />
    </HydrationBoundary>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { reportId: string };
}): Promise<Metadata> {
  return {
    title: `Crime Report #${params.reportId}`,
    description: "Detailed view of crime report",
    openGraph: {
      title: `Crime Report Details | Anti Crime`,
      description: "View detailed information about this crime report",
    },
  };
}
