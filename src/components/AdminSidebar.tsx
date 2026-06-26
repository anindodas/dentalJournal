import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  LayoutDashboard,
  FileText,
  Mail,
  PenLine,
  Search,
  Users,
} from "lucide-react";
import LogoutButton from "@/components/admin/LogoutButton";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/posts", label: "Articles", icon: FileText },
  { href: "/admin/seo", label: "Page SEO", icon: Search },
  { href: "/admin/newsletter", label: "Newsletter", icon: Users },
  { href: "/admin/write-for-us", label: "Write for Us", icon: PenLine },
  { href: "/admin/messages", label: "Messages", icon: Mail },
];

export default async function AdminSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-card">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link href="/admin" className="font-serif text-lg font-bold text-primary">
            Admin
          </Link>
        </div>
        <nav className="space-y-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-primary"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
          {session && (
            <p className="mb-3 truncate text-xs text-muted-foreground">{session.email}</p>
          )}
          <LogoutButton />
          <Link
            href="/"
            className="mt-2 block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
          >
            ← View Site
          </Link>
        </div>
      </aside>
      <main className="ml-64 flex-1 p-8">{children}</main>
    </div>
  );
}

export async function requireAdminLayout() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}
