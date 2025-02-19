import Layout from "@/components/layout/layout";
export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
