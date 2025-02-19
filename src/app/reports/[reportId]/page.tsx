import { getReportById } from "@/actions/reports";
import ReportDetailsContainer from "@/app/reports/[reportId]/components";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

type ReportPageProps = {
  params: { reportId: string };
};

export default async function ReportPage({ params }: ReportPageProps) {
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
