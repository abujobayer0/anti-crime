import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import CrimeReportsViewer from "./components/Viewer";
import { getAlgorithmicReports } from "@/actions/reports";
const Page = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["algorithmic-reports"],
    queryFn: getAlgorithmicReports,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CrimeReportsViewer />
    </HydrationBoundary>
  );
};
export default Page;
