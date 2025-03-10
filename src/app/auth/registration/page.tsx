"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AuthenticationPageBody from "@/components/common/AuthenticationPageBody";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks";
interface RegistrationFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

const RegistrationPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegistrationFormData>();

  const { register: registerUser } = useAuth();
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data: RegistrationFormData) => {
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await registerUser.mutateAsync({
        name: data.name,
        email: data.email,
        password: data.password,
        contact: data.phone,
      });
    } catch (err: any) {
      setError(err.data?.message || "Registration failed");
    }
  };

  return (
    <AuthenticationPageBody
      title="Create an Account"
      subtitle="Please enter your details to continue"
      form={
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Full Name
            </Label>
            <Input
              type="text"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
              })}
              className="h-11 bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary/30"
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Email address
            </Label>
            <Input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="h-11 bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary/30"
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Phone Number
            </Label>
            <Input
              type="tel"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{11}$/,
                  message: "Invalid phone number",
                },
              })}
              className="h-11 bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary/30"
              placeholder="01XXXXXXXXX"
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Password
            </Label>
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
                className="h-11 bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary/30"
                placeholder="••••••••"
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
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (val: string) => {
                    if (watch("password") != val) {
                      return "Passwords do not match";
                    }
                  },
                })}
                className="h-11 bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary/30"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {error && (
            <p className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full h-11 bg-primary hover:bg-primary/90"
            disabled={registerUser.isPending}
          >
            {registerUser.isPending ? "Creating account..." : "Create account"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-primary hover:text-primary/90 transition-colors font-medium"
            >
              Sign in
            </Link>
          </p>
        </form>
      }
    />
  );
};

export default RegistrationPage;
