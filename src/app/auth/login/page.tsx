"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AuthenticationPageBody from "@/components/common/AuthenticationPageBody";
import { useAuth } from "@/hooks/api/useAuth";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { setCredentials } from "@/redux/features/auth/authSlice";
import Cookies from "js-cookie";
import { RegistrationSvg } from "@/components/auth/registration-svg";
import { Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    email: string;
    password: string;
  }>();
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      const result = await login.mutateAsync(data);
      if (result?.data?.accessToken) {
        dispatch(
          setCredentials({
            user: result.data.user,
            token: result.data.accessToken,
          })
        );
        Cookies.set("accessToken", result.data.accessToken);
        router.push("/");
      }
    } catch (err: any) {
      setError(err.data?.message || "Something went wrong!");
    }
  };

  return (
    (<AuthenticationPageBody
      title="Welcome back"
      subtitle="Enter your credentials to access your account"
      illustration={<RegistrationSvg />}
      form={
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Email</Label>
            <Input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email format",
                },
              })}
              placeholder="example@gmail.com"
              className="h-11 bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary/30"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-foreground">
                Password
              </Label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary hover:text-primary/90 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                placeholder="••••••••"
                className="h-11 bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={login.isPending}
            className="w-full h-11 bg-primary hover:bg-primary/90 text-white transition-all duration-300"
          >
            {login.isPending ? "Signing in..." : "Sign in"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/auth/registration"
              className="text-primary hover:text-primary/90 transition-colors font-medium"
            >
              Sign up
            </Link>
          </p>
        </form>
      }
    />)
  );
};

export default LoginPage;
