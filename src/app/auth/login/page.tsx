"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import registrationBg from "../../../../assets/images/registration.png";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AuthenticationPageBody from "@/components/common/AuthenticationPageBody";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>();
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();
  const [error, setError] = useState("");

  // Form submission handler
  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      const credentials = {
        email: data.email,
        password: data.password,
      };
      const res = await login(credentials).unwrap();
      if (res.success) {
        setError("");
        router.push("/");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.data.message);
      console.log(err);
    }
  };

  return (
    <AuthenticationPageBody
      src={registrationBg.src}
      title="Login"
      form={
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3 shadow-md p-4 rounded-md"
        >
          {/* Email Input */}
          <div className="space-y-2">
            <Label>Email</Label>
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
              className="outline-none"
            />
            {errors.email && typeof errors.email.message === "string" && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              placeholder="******"
              className="outline-none"
            />
            {errors.password && typeof errors.password.message === "string" && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Already have an account */}
          <p className="text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              className="text-sky-600 font-medium hover:underline"
              href="/auth/registration"
            >
              Registration
            </Link>
          </p>

          {/* Submit Button */}
          <Button
            disabled={isLoading}
            type="submit"
            className="bg-[#309689] hover:bg-[#207267] w-full transition-all duration-300 active:scale-95"
          >
            {isLoading ? "Loading..." : "Login"}
          </Button>
          {error && <p className="text-red-500 font-medium">{error}</p>}
        </form>
      }
    />
  );
};

export default LoginPage;
