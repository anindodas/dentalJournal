import AdminSidebar, { requireAdminLayout } from "@/components/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminLayout();
  return <AdminSidebar>{children}</AdminSidebar>;
}
