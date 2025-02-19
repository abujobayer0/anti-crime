import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/api/client";
import { toast } from "sonner";

export const useProfile = () => {
  const queryClient = useQueryClient();

  const updateProfile = useMutation({
    mutationFn: async (profileData: any) => {
      const { data } = await apiClient.patch(`/users/${profileData.id}`, {
        name: profileData.name,
        contact: profileData.contact,
        bio: profileData.bio,
        profileImage: profileData.profileImage,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Profile updated successfully");
    },
  });

  const verifyOTP = useMutation({
    mutationFn: async ({ phone, otp }: { phone: string; otp: string }) => {
      const { data } = await apiClient.post("/auth/verify-otp", { phone, otp });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Phone number verified successfully");
    },
  });

  const sendOTP = useMutation({
    mutationFn: async (phone: string) => {
      const { data } = await apiClient.post("/auth/send-otp", { phone });
      return data;
    },
    onSuccess: () => {
      toast.success("OTP sent successfully");
    },
  });

  return {
    updateProfile,
    verifyOTP,
    sendOTP,
  };
};
