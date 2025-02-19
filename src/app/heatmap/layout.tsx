import Layout from "@/components/layout/layout";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Crime Heatmap",
  description: "Visualize crime hotspots and patterns in your area",
  openGraph: {
    title: "Crime Heatmap | Anti Crime",
    description: "Interactive map showing crime incident patterns and hotspots",
  },
};

const HeatmapLayout = ({ children }: { children: React.ReactNode }) => {
  return <Layout>{children}</Layout>;
};

export default HeatmapLayout;
