"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, Eye, EyeOff } from "lucide-react";
import { formatDate } from "@/lib/utils";

type Post = {
  id: string;
  title: string;
  author: string;
  category: string;
  published: boolean;
  featured: boolean;
  publishedAt: string | null;
  slug: string;
};

export default function AdminPostsList({ posts }: { posts: Post[] }) {
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm("Delete this article?")) return;
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary">Articles</h1>
          <p className="text-muted-foreground">Manage blog articles</p>
        </div>
        <Link href="/admin/posts/new" className="btn-primary">
          <Plus className="mr-2 h-4 w-4" />
          New Article
        </Link>
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-muted">Title</th>
              <th className="px-6 py-3 text-left font-medium text-muted">Author</th>
              <th className="px-6 py-3 text-left font-medium text-muted">Category</th>
              <th className="px-6 py-3 text-left font-medium text-muted">Status</th>
              <th className="px-6 py-3 text-left font-medium text-muted">Date</th>
              <th className="px-6 py-3 text-right font-medium text-muted">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-primary">{post.title}</td>
                <td className="px-6 py-4 text-muted">{post.author}</td>
                <td className="px-6 py-4 text-muted">{post.category}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      post.published
                        ? "bg-green-50 text-green-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {post.published ? (
                      <Eye className="h-3 w-3" />
                    ) : (
                      <EyeOff className="h-3 w-3" />
                    )}
                    {post.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted">
                  {post.publishedAt ? formatDate(post.publishedAt) : "—"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="rounded-lg p-2 text-slate-500 hover:bg-sky-50 hover:text-primary"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && (
          <p className="px-6 py-8 text-center text-muted">No articles yet.</p>
        )}
      </div>
    </div>
  );
}
