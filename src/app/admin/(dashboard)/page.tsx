import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAdminStats } from "@/lib/queries";
import Link from "next/link";
import { FileText, Inbox, Mail, Users } from "lucide-react";

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  let stats = {
    posts: 0,
    subscribers: 0,
    unreadMessages: 0,
    pendingWriteForUs: 0,
  };
  try {
    stats = await getAdminStats();
  } catch {
    // tables may not exist yet
  }

  const cards = [
    { label: "Total Articles", value: stats.posts, icon: FileText, href: "/admin/posts" },
    { label: "Newsletter Subscribers", value: stats.subscribers, icon: Users, href: "/admin/newsletter" },
    { label: "Unread Messages", value: stats.unreadMessages, icon: Mail, href: "/admin/messages" },
    {
      label: "Pending Pitches",
      value: stats.pendingWriteForUs,
      icon: Inbox,
      href: "/admin/write-for-us",
    },
  ];

  return (
    <div>
      <h1 className="mb-2 font-serif text-3xl font-bold text-primary">Dashboard</h1>
      <p className="mb-8 text-muted-foreground">Welcome back, {session.name}</p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((stat) => (
          <Link key={stat.label} href={stat.href} className="card transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-3xl font-bold text-primary">{stat.value}</p>
              </div>
              <stat.icon className="h-8 w-8 text-accent/40" />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 card">
        <h2 className="mb-4 font-semibold text-primary">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/posts/new" className="btn-primary">
            New Article
          </Link>
          <Link href="/admin/seo" className="btn-secondary">
            Edit Page SEO
          </Link>
          <Link href="/" className="btn-secondary">
            View Website
          </Link>
        </div>
      </div>
    </div>
  );
}
