import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Anti Crime account",
  openGraph: {
    title: "Sign In | Anti Crime",
    description: "Access your Anti Crime account",
  },
};

const LoginLayout = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default LoginLayout;
