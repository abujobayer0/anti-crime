import React from "react";
import Layout from "@/components/layout/layout";

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
