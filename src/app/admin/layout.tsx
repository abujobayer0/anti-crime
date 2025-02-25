import Layout from "@/components/layout/layout";
import { Metadata } from "next";
import React from "react";
import AdminHeader from "./components/AdminHeader";

export const metadata: Metadata = {
  title: "Crime Reporting Admin",
  description: "Admin panel for the Crime Reporting Platform",
};

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout>
      <div className="flex relative h-screen bg-background">
        <AdminHeader />
        {children}
      </div>
    </Layout>
  );
};

export default layout;
