import Layout from "@/components/layout/layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your profile and view your crime reports",
  openGraph: {
    title: "Profile | Anti Crime",
    description: "Manage your Anti Crime profile and reports",
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
