import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/provider/QueryProvider";

import { Toaster } from "sonner";
import ReduxProvider from "@/provider/ReduxProvider";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

export const viewport: Viewport = {
  themeColor: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
export const metadata: Metadata = {
  title: {
    default: "Anti Crime - Community Safety Platform",
    template: "%s | Anti Crime",
  },
  description:
    "A community-driven platform for reporting and tracking crime incidents to create safer neighborhoods.",
  keywords: [
    "crime reporting",
    "community safety",
    "incident tracking",
    "public safety",
    "crime prevention",
    "neighborhood watch",
    "crime alerts",
    "safety monitoring",
  ],
  authors: [
    {
      name: "Abu Talha Md Jobayer ",
    },
  ],
  creator: "Abu Talha Md Jobayer",
  publisher: "Abu Talha Md Jobayer",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://anticrime.com",
    title: "Anti Crime - Community Safety Platform",
    description:
      "A community-driven platform for reporting and tracking crime incidents to create safer neighborhoods.",
    siteName: "Anti Crime",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anti Crime - Community Safety Platform",
    description:
      "A community-driven platform for reporting and tracking crime incidents to create safer neighborhoods.",
    creator: "@anticrime",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} bg-background antialiased`}>
        <Toaster />
        <ReduxProvider>
          <QueryProvider>{children}</QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
