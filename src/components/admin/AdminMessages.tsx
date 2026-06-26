"use client";

import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Trash2 } from "lucide-react";

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function AdminMessagesClient({ initial }: { initial: Message[] }) {
  const router = useRouter();

  async function markRead(id: string) {
    await fetch(`/api/contact/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    });
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/contact/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-primary">Messages</h1>
        <p className="text-muted">Contact form messages from visitors</p>
      </div>

      <div className="space-y-4">
        {initial.map((m) => (
          <div
            key={m.id}
            className={`card ${!m.read ? "border-l-4 border-l-primary" : ""}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-primary">{m.subject}</h3>
                  {!m.read && (
                    <span className="rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-primary">
                      New
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted">
                  {m.name} · {m.email} · {formatDate(m.createdAt)}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {m.message}
                </p>
              </div>
              <div className="flex gap-2">
                {!m.read && (
                  <button
                    onClick={() => markRead(m.id)}
                    className="btn-secondary text-xs"
                  >
                    Mark Read
                  </button>
                )}
                <button
                  onClick={() => handleDelete(m.id)}
                  className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {initial.length === 0 && (
          <p className="text-center text-muted">No messages yet.</p>
        )}
      </div>
    </div>
  );
}
