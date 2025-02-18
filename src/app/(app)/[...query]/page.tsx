import { ReportsListContainer } from "@/components/global/reports/reports-list/ReportsList.container";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function SearchPage({
  params,
}: {
  params: { q: string[] };
}) {
  const queryClient = new QueryClient();
  const searchQuery = params.q?.[0] ? decodeURIComponent(params.q[0]) : "";

  return (
    <div className="container mt-5 mx-auto px-4">
      <div className="mb-6">
        {searchQuery ? (
          <h1 className="text-2xl font-semibold">
            Search results for "{searchQuery}"
          </h1>
        ) : (
          <h1 className="text-2xl font-semibold">All Reports</h1>
        )}
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <ReportsListContainer />
      </HydrationBoundary>
    </div>
  );
}
