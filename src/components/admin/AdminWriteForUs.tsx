"use client";

import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";

type Submission = {
  id: string;
  name: string;
  email: string;
  topic: string;
  bio: string | null;
  sample_url: string | null;
  message: string;
  status: string;
  createdAt: string;
};

export default function AdminWriteForUsClient({
  initial,
}: {
  initial: Submission[];
}) {
  const router = useRouter();

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/write-for-us/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-primary">Write for Us</h1>
        <p className="text-muted-foreground">Guest post pitches and submissions</p>
      </div>

      <div className="space-y-4">
        {initial.map((s) => (
          <div key={s.id} className="card">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-primary">{s.topic}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {s.name} · {s.email} · {formatDate(s.createdAt)}
                </p>
                {s.bio && (
                  <p className="mt-2 text-sm text-muted-foreground">{s.bio}</p>
                )}
                {s.sample_url && (
                  <a
                    href={s.sample_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-sm text-primary hover:underline"
                  >
                    Sample writing
                  </a>
                )}
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {s.message}
                </p>
              </div>
              <select
                value={s.status}
                onChange={(e) => updateStatus(s.id, e.target.value)}
                className="input-field w-auto"
              >
                <option value="pending">Pending</option>
                <option value="reviewing">Reviewing</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        ))}
        {initial.length === 0 && (
          <p className="text-center text-muted-foreground">No submissions yet.</p>
        )}
      </div>
    </div>
  );
}
