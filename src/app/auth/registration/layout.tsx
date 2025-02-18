import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Join Anti Crime to help make your community safer",
  openGraph: {
    title: "Sign Up | Anti Crime",
    description:
      "Create your Anti Crime account to report and track crime incidents",
  },
};
const RegistrationLayout = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default RegistrationLayout;
