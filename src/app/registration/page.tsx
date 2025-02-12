"use client";

import React from "react";
import { useForm } from "react-hook-form";
import registrationBg from "../../../assets/images/registration.png";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AuthenticationPageBody from "@/components/common/AuthenticationPageBody";

const RegistrationPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Form submission handler
  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };

  return (
    <AuthenticationPageBody
      ltr={true}
      src={registrationBg.src}
      title="Create New Account"
      form={
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3 shadow-md p-4 rounded-md"
        >
          {/* Name Input */}
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              {...register("name", { required: "Name is required" })}
              placeholder="Enter your name"
              className="outline-none"
            />
            {errors.name && typeof errors.name.message === "string" && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>

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

          {/* Phone Number Input */}
          <div className="space-y-2">
            <Label>Mobile</Label>
            <Input
              type="number"
              {...register("mobile", {
                required: "Mobile number is required",
              })}
              placeholder="017XXXXXXXX"
              className="outline-none"
            />
            {errors.mobile && typeof errors.mobile.message === "string" && (
              <p className="text-red-500">{errors.mobile.message}</p>
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
              placeholder="......."
              className="outline-none"
            />
            {errors.password && typeof errors.password.message === "string" && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Already have an account */}
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              className="text-sky-600 font-medium hover:underline"
              href="/login"
            >
              Login
            </Link>
          </p>

          {/* Submit Button */}
          <Button
            type="submit"
            className="bg-[#309689] hover:bg-[#207267] w-full transition-all duration-300 active:scale-95"
          >
            Register
          </Button>
        </form>
      }
    />
  );
};

export default RegistrationPage;
