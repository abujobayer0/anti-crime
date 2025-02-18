import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Notifications",
  description: "Stay updated with alerts and notifications about crime reports",
  openGraph: {
    title: "Notifications | Anti Crime",
    description: "Your crime alerts and notification center",
  },
};

const NotificationsLayout = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default NotificationsLayout;
