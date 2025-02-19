import { Metadata } from "next";
import React from "react";
import Layout from "@/components/layout/layout";

export const metadata: Metadata = {
  title: "Notifications",
  description: "Stay updated with alerts and notifications about crime reports",
  openGraph: {
    title: "Notifications | Anti Crime",
    description: "Your crime alerts and notification center",
  },
};

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
