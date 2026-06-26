"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

type Issue = {
  id: string;
  volume: number;
  number: number;
  year: number;
  title: string;
  description: string | null;
  publishedAt: string;
};

export default function AdminIssuesClient({ initial }: { initial: Issue[] }) {
  const router = useRouter();
  const [issues, setIssues] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    volume: 1,
    number: 1,
    year: new Date().getFullYear(),
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/issues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, published: true }),
    });
    if (res.ok) {
      setShowForm(false);
      router.refresh();
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this issue?")) return;
    await fetch(`/api/issues/${id}`, { method: "DELETE" });
    setIssues((prev) => prev.filter((i) => i.id !== id));
    router.refresh();
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary">Issues</h1>
          <p className="text-muted">Manage journal volumes and issues</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Plus className="mr-2 h-4 w-4" />
          New Issue
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card mb-6 grid gap-4 sm:grid-cols-2">
          <input
            type="number"
            required
            placeholder="Volume"
            className="input-field"
            value={form.volume}
            onChange={(e) => setForm({ ...form, volume: +e.target.value })}
          />
          <input
            type="number"
            required
            placeholder="Number"
            className="input-field"
            value={form.number}
            onChange={(e) => setForm({ ...form, number: +e.target.value })}
          />
          <input
            type="number"
            required
            placeholder="Year"
            className="input-field"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: +e.target.value })}
          />
          <input
            required
            placeholder="Title"
            className="input-field sm:col-span-2"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            rows={3}
            className="textarea-field sm:col-span-2"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button type="submit" disabled={loading} className="btn-primary sm:col-span-2">
            {loading ? "Creating..." : "Create Issue"}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {issues.map((issue) => (
          <div key={issue.id} className="card flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-primary">{issue.title}</h3>
              <p className="mt-1 text-sm text-muted">
                Vol. {issue.volume}, No. {issue.number} ({issue.year}) ·{" "}
                {formatDate(issue.publishedAt)}
              </p>
              {issue.description && (
                <p className="mt-2 text-sm text-slate-600">{issue.description}</p>
              )}
            </div>
            <button
              onClick={() => handleDelete(issue.id)}
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
