import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ENDPOINTS } from "@/api/config";
import { useApi } from "./useApi";

export const useFollowers = () => {
  const { client, handleError, handleSuccess } = useApi();
  const queryClient = useQueryClient();

  const getFollowers = useQuery({
    queryKey: ["followers"],
    queryFn: () => client.get(ENDPOINTS.followers.list),
    refetchInterval: 1000 * 30,
  });

  const follow = useMutation({
    mutationFn: async (userId: string) => {
      const { data } = await client.post(ENDPOINTS.followers.follow(userId));
      return data;
    },
    onSuccess: async (data) => {
      handleSuccess("Followed successfully");
      await queryClient.invalidateQueries({
        queryKey: ["check-follow-status", data.userId],
      });
    },
    onError: (error) => {
      handleError(error);
    },
  });

  const unfollow = useMutation({
    mutationFn: async (userId: string) => {
      const { data } = await client.post(ENDPOINTS.followers.unfollow(userId));
      return data;
    },
    onSuccess: async (data) => {
      handleSuccess("Unfollowed successfully");
      await queryClient.invalidateQueries({
        queryKey: ["check-follow-status", data.userId],
      });
    },
    onError: (error) => {
      handleError(error);
    },
  });

  const checkFollowStatus = (userId: string) =>
    useQuery({
      queryKey: ["check-follow-status", userId],
      queryFn: async () => {
        const { data } = await client.get(
          ENDPOINTS.followers.checkFollowStatus(userId)
        );
        return data;
      },
      staleTime: 0,
    });

  return { getFollowers, follow, unfollow, checkFollowStatus };
};
