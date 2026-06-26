import { getAllPageSeo } from "@/lib/queries";
import AdminSeoEditor from "@/components/admin/AdminSeoEditor";

export default async function AdminSeoPage() {
  let pages: Awaited<ReturnType<typeof getAllPageSeo>> = [];
  try {
    pages = await getAllPageSeo();
  } catch {
    // tables may not exist yet
  }

  return <AdminSeoEditor initial={pages} />;
}
