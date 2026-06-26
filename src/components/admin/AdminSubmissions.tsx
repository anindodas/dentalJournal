"use client";

import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Trash2 } from "lucide-react";

type Submission = {
  id: string;
  name: string;
  email: string;
  title: string;
  abstract: string;
  keywords: string | null;
  status: string;
  createdAt: string;
};

const statuses = ["pending", "reviewing", "accepted", "rejected"] as const;

export default function AdminSubmissionsClient({
  initial,
}: {
  initial: Submission[];
}) {
  const router = useRouter();

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this submission?")) return;
    await fetch(`/api/submissions/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-primary">Submissions</h1>
        <p className="text-muted">Review paper submissions from authors</p>
      </div>

      <div className="space-y-4">
        {initial.map((s) => (
          <div key={s.id} className="card">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-primary">{s.title}</h3>
                <p className="mt-1 text-sm text-muted">
                  {s.name} · {s.email} · {formatDate(s.createdAt)}
                </p>
                {s.keywords && (
                  <p className="mt-1 text-xs text-muted">Keywords: {s.keywords}</p>
                )}
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {s.abstract}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <select
                  value={s.status}
                  onChange={(e) => updateStatus(s.id, e.target.value)}
                  className="input-field w-auto text-xs"
                >
                  {statuses.map((st) => (
                    <option key={st} value={st}>
                      {st.charAt(0).toUpperCase() + st.slice(1)}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {initial.length === 0 && (
          <p className="text-center text-muted">No submissions yet.</p>
        )}
      </div>
    </div>
  );
}
