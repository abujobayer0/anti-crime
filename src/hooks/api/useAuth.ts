import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/api/client";
import { ENDPOINTS } from "@/api/config";
import { useAppDispatch } from "@/redux/hooks";
import {
  setCredentials,
  logout as logoutAction,
} from "@/redux/features/auth/authSlice";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  name: string;
  contact: string;
}

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();

  const login = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await apiClient.post(ENDPOINTS.auth.login, credentials);
      return data;
    },
    onSuccess: (data) => {
      const userData = {
        token: data.data.accessToken,
        user: {
          id: data.data.result._id,
          email: data.data.result.email,
          role: data.data.result.role,
          name: data.data.result.name,
          contact: data.data.result.contact,
        },
      };

      dispatch(setCredentials(userData));
      Cookies.set("accessToken", data.data.accessToken, { expires: 7 });
      Cookies.set("role", userData.user.role, { expires: 7 });
      queryClient.setQueryData(["user"], data.data.result);
      router.push("/");
      toast.success("Login successful");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Login failed");
    },
  });
  const reset = useMutation({
    mutationFn: async (credentials: { email: string }) => {
      const { data } = await apiClient.post(ENDPOINTS.auth.reset, credentials);
      return data;
    },

    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const forgotPassword = useMutation({
    mutationFn: async (credentials: {
      email: string;
      newPassword: string;
      token: string;
    }) => {
      const { data } = await apiClient.post(
        ENDPOINTS.auth.forgetPassword,
        credentials
      );
      return data;
    },

    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const changePassword = useMutation({
    mutationFn: async (credentials: {
      currentPassword: string;
      newPassword: string;
    }) => {
      const { data } = await apiClient.post(
        ENDPOINTS.auth.changePassword,
        credentials
      );
      return data;
    },
  });

  const register = useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const { data } = await apiClient.post(
        ENDPOINTS.auth.register,
        credentials
      );
      return data;
    },
    onSuccess: (data) => {
      const userData = {
        token: data.data.accessToken,
        user: {
          id: data.data.result._id,
          email: data.data.result.email,
          role: data.data.result.role,
          name: data.data.result.name,
          contact: data.data.result.contact,
        },
      };

      dispatch(setCredentials(userData));
      Cookies.set("accessToken", data.data.accessToken, { expires: 7 });
      Cookies.set("role", userData.user.role, { expires: 7 });
      queryClient.setQueryData(["user"], data.data.result);
      router.push("/");
      toast.success("Registration successful");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Registration failed");
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      Cookies.remove("accessToken");
      Cookies.remove("role");
      Cookies.remove("isBanned");
      return null;
    },
    onSuccess: () => {
      queryClient.clear();
      dispatch(logoutAction());
      router.push("/auth/login");
      toast.success("Logged out successfully");
    },
  });

  return {
    login,
    register,
    logout,
    reset,
    changePassword,
    forgotPassword,
  };
};
