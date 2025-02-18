import { getReportById, getReportComments } from "@/actions/reports";
import ReportDetails from "@/components/global/reports/report-details";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function ReportPage({
  params,
}: {
  params: { reportId: string };
}) {
  const queryClient = new QueryClient();

  // Prefetch both report and comments data
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["reports", params.reportId],
      queryFn: () => getReportById(params.reportId),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReportDetails reportId={params.reportId} />
    </HydrationBoundary>
  );
}
