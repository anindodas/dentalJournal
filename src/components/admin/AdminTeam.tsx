"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

type Member = {
  id: string;
  name: string;
  role: string;
  title: string | null;
  bio: string | null;
  email: string | null;
  order: number;
};

export default function AdminTeamClient({ initial }: { initial: Member[] }) {
  const router = useRouter();
  const [members, setMembers] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    role: "",
    title: "",
    bio: "",
    email: "",
    order: 0,
  });
  const [loading, setLoading] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setShowForm(false);
      router.refresh();
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this team member?")) return;
    await fetch(`/api/team/${id}`, { method: "DELETE" });
    setMembers((prev) => prev.filter((m) => m.id !== id));
    router.refresh();
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary">
            Editorial Team
          </h1>
          <p className="text-muted">Manage editorial board members</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Plus className="mr-2 h-4 w-4" />
          Add Member
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card mb-6 grid gap-4 sm:grid-cols-2">
          <input
            required
            placeholder="Name"
            className="input-field"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            required
            placeholder="Role (e.g. Editor-in-Chief)"
            className="input-field"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />
          <input
            placeholder="Title / Affiliation"
            className="input-field sm:col-span-2"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            placeholder="Bio"
            rows={3}
            className="textarea-field sm:col-span-2"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="input-field"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="number"
            placeholder="Display order"
            className="input-field"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: +e.target.value })}
          />
          <button type="submit" disabled={loading} className="btn-primary sm:col-span-2">
            {loading ? "Adding..." : "Add Member"}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {members.map((m) => (
          <div key={m.id} className="card flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-primary">{m.name}</h3>
              <p className="text-sm font-medium text-accent">{m.role}</p>
              {m.title && <p className="text-sm text-muted">{m.title}</p>}
            </div>
            <button
              onClick={() => handleDelete(m.id)}
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
