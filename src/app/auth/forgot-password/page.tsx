"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AuthenticationPageBody from "@/components/common/AuthenticationPageBody";
import { Check, ArrowLeft, Eye, EyeOff, Shield } from "lucide-react";
import { useAuth } from "@/hooks";

interface ForgotPasswordFormInputs {
  email: string;
  newPassword: string;
  confirmPassword: string;
  token: string;
}

const ForgotPasswordPageContent = () => {
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ForgotPasswordFormInputs>();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const { forgotPassword } = useAuth();

  const newPassword = watch("newPassword");

  useEffect(() => {
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (email) {
      setValue("email", email);
    }

    if (token) {
      setValue("token", token);
      validateToken(token);
    } else {
      setTokenValid(false);
      setError(
        "Invalid or missing reset token. Please request a new password reset link."
      );
    }
  }, [searchParams, setValue]);

  const validateToken = async (token: string) => {
    try {
      if (token && token.split(".").length === 3) {
        setTokenValid(true);
      } else {
        setTokenValid(false);
        setError("This password reset link appears to be invalid.");
      }
    } catch (err) {
      setTokenValid(false);
      setError(
        "There was a problem validating your reset link. Please request a new one."
      );
    }
  };

  const onSubmit = async (data: ForgotPasswordFormInputs) => {
    if (data.newPassword !== data.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await forgotPassword.mutateAsync({
        email: data.email,
        newPassword: data.newPassword,
        token: data.token,
      });
      setIsSuccess(true);
    } catch (err: any) {
      setError(
        err.data?.message ||
          "Failed to reset your password. Please try again or request a new link."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AuthenticationPageBody
      title="Create New Password"
      subtitle="Set a new password for your account"
      form={
        <>
          {!isSuccess ? (
            <>
              {tokenValid ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-700 flex items-start gap-2">
                      <Shield className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <span>
                        Create a strong password that you don't use for other
                        websites. Your password should be at least 8 characters
                        long with a mix of letters, numbers, and symbols.
                      </span>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Email Address
                    </Label>
                    <Input
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "Invalid email format",
                        },
                      })}
                      readOnly
                      className="h-11 bg-muted/30 border-0 focus-visible:ring-2 focus-visible:ring-primary/30"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        {...register("newPassword", {
                          required: "New password is required",
                          minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters",
                          },
                          pattern: {
                            value:
                              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                            message:
                              "Password must include uppercase, lowercase, number and special character",
                          },
                        })}
                        placeholder="Create a strong password"
                        className="h-11 bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary/30 pr-10"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="text-sm text-red-500">
                        {errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Confirm Password
                    </Label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === newPassword || "Passwords do not match",
                      })}
                      placeholder="Confirm your password"
                      className="h-11 bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary/30"
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <input type="hidden" {...register("token")} />

                  {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 bg-primary hover:bg-primary/90 text-white transition-all duration-300"
                  >
                    {isLoading ? "Updating password..." : "Reset Password"}
                  </Button>

                  <div className="flex justify-center">
                    <Link
                      href="/auth/login"
                      className="text-sm text-primary hover:text-primary/90 transition-colors flex items-center gap-1"
                    >
                      <ArrowLeft className="h-3 w-3" />
                      Back to login
                    </Link>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <p className="text-sm text-red-700 flex items-start gap-2">
                      <Shield className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </p>
                  </div>

                  <Link href="/auth/reset-password">
                    <Button className="w-full h-11 bg-primary hover:bg-primary/90 text-white transition-all duration-300">
                      Request New Reset Link
                    </Button>
                  </Link>

                  <div className="flex justify-center">
                    <Link
                      href="/auth/login"
                      className="text-sm text-primary hover:text-primary/90 transition-colors flex items-center gap-1"
                    >
                      <ArrowLeft className="h-3 w-3" />
                      Back to login
                    </Link>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center space-y-4 py-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-semibold">
                    Password Reset Successfully
                  </h3>
                  <p className="text-muted-foreground">
                    Your password has been successfully updated. You can now log
                    in with your new password.
                  </p>
                </div>
              </div>

              <Link href="/auth/login">
                <Button className="w-full h-11 bg-primary hover:bg-primary/90 text-white transition-all duration-300">
                  Go to Login
                </Button>
              </Link>
            </div>
          )}
        </>
      }
    />
  );
};
const ForgotPasswordPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPasswordPageContent />
    </Suspense>
  );
};

export default ForgotPasswordPage;
