"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

type Announcement = {
  id: string;
  title: string;
  content: string;
  link: string | null;
  published: boolean;
};

export default function AdminAnnouncementsClient({
  initial,
}: {
  initial: Announcement[];
}) {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", link: "" });
  const [loading, setLoading] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, published: true }),
    });
    if (res.ok) {
      setShowForm(false);
      setForm({ title: "", content: "", link: "" });
      router.refresh();
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this announcement?")) return;
    await fetch(`/api/announcements/${id}`, { method: "DELETE" });
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    router.refresh();
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary">
            Announcements
          </h1>
          <p className="text-muted">Manage homepage announcements</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Plus className="mr-2 h-4 w-4" />
          New Announcement
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card mb-6 space-y-4">
          <input
            required
            placeholder="Title"
            className="input-field"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            required
            placeholder="Content"
            rows={3}
            className="textarea-field"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
          <input
            placeholder="Link (optional, e.g. /submissions)"
            className="input-field"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
          />
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Creating..." : "Create"}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {announcements.map((a) => (
          <div key={a.id} className="card flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-primary">{a.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{a.content}</p>
              {a.link && (
                <p className="mt-1 text-xs text-muted">Link: {a.link}</p>
              )}
            </div>
            <button
              onClick={() => handleDelete(a.id)}
              className="rounded-lg p-2 text-red-500 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
