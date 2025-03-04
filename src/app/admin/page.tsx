import AdminDashboard from "./components/AdminDashboard";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { getAllUsers, getBannedUsers } from "@/hooks/api/useUser";
const AdminPage = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });
  await queryClient.prefetchQuery({
    queryKey: ["banned-users"],
    queryFn: getBannedUsers,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminDashboard />
    </HydrationBoundary>
  );
};
export default AdminPage;
