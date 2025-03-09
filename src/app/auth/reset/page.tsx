"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AuthenticationPageBody from "@/components/common/AuthenticationPageBody";
import { Check, ArrowLeft, Mail } from "lucide-react";
import { useAuth } from "@/hooks";

interface ResetPasswordFormInputs {
  email: string;
}

const ResetPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormInputs>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const { reset } = useAuth();

  const onSubmit = async (data: ResetPasswordFormInputs) => {
    setIsLoading(true);
    setError("");

    try {
      await reset.mutateAsync({
        email: data.email,
      });
      setIsSuccess(true);
    } catch (err: any) {
      setError(
        err.data?.message || "Failed to process your request. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthenticationPageBody
      title="Reset Password"
      subtitle="Enter your email address to receive a password reset link"
      form={
        <>
          {!isSuccess ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-700 flex items-start gap-2">
                  <Mail className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>
                    We'll send a secure link to your email that will allow you
                    to reset your password. The link will expire after 30
                    minutes.
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
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Invalid email format",
                    },
                  })}
                  placeholder="you@example.com"
                  className="h-11 bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary/30"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

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
                {isLoading ? "Sending link..." : "Send Reset Link"}
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
              <div className="flex flex-col items-center justify-center space-y-4 py-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-semibold">Check your email</h3>
                  <p className="text-muted-foreground">
                    We've sent a password reset link to your email address.
                    Please check your inbox and spam folder.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-700">
                  Didn't receive the email? Check your spam folder or request
                  another link in 5 minutes.
                </p>
              </div>

              <Button
                onClick={() => setIsSuccess(false)}
                variant="outline"
                className="w-full h-11 border-primary/20 text-primary hover:bg-primary/5"
              >
                Send Another Link
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
            </div>
          )}
        </>
      }
    />
  );
};

export default ResetPasswordPage;
