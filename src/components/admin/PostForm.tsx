"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type PostFormData = {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  cover_image: string;
  published: boolean;
  featured: boolean;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  reads: number;
  reads_per_day: number;
};

type PostFormProps = {
  initial?: Partial<PostFormData>;
  postId?: string;
};

const categories = [
  "Dental Health",
  "Oral Hygiene",
  "Cosmetic Dentistry",
  "Pediatric Care",
  "Gum Health",
  "Tips & Guides",
];

export default function PostForm({ initial, postId }: PostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<PostFormData>({
    title: initial?.title || "",
    excerpt: initial?.excerpt || "",
    content: initial?.content || "",
    author: initial?.author || "",
    category: initial?.category || "Dental Health",
    cover_image: initial?.cover_image || "",
    published: initial?.published ?? false,
    featured: initial?.featured ?? false,
    meta_title: initial?.meta_title || "",
    meta_description: initial?.meta_description || "",
    meta_keywords: initial?.meta_keywords || "",
    reads: initial?.reads ?? 0,
    reads_per_day: initial?.reads_per_day ?? 12,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = postId ? `/api/posts/${postId}` : "/api/posts";
      const method = postId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          cover_image: form.cover_image || null,
          meta_title: form.meta_title || null,
          meta_description: form.meta_description || null,
          meta_keywords: form.meta_keywords || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      router.push("/admin/posts");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card max-w-3xl space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium">Title *</label>
        <input
          required
          className="input-field"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Author *</label>
          <input
            required
            className="input-field"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Category</label>
          <select
            className="input-field"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Cover image URL</label>
        <input
          className="input-field"
          value={form.cover_image}
          onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Excerpt *</label>
        <textarea
          required
          rows={3}
          className="textarea-field"
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Content * (HTML supported)
        </label>
        <textarea
          required
          rows={12}
          className="textarea-field font-mono text-xs"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="<p>Your article content here...</p>"
        />
      </div>

      <div className="rounded-lg border border-border p-4">
        <p className="mb-4 text-sm font-medium text-primary">Reads</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Starting read count</label>
            <input
              type="number"
              min={0}
              className="input-field"
              value={form.reads}
              onChange={(e) =>
                setForm({ ...form, reads: Math.max(0, parseInt(e.target.value, 10) || 0) })
              }
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Base number shown on the article. Grows automatically over time.
            </p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Reads per day</label>
            <input
              type="number"
              min={0}
              className="input-field"
              value={form.reads_per_day}
              onChange={(e) =>
                setForm({
                  ...form,
                  reads_per_day: Math.max(0, parseInt(e.target.value, 10) || 0),
                })
              }
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Added each day after the count was last saved (default: 12/day).
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border p-4">
        <p className="mb-4 text-sm font-medium text-primary">SEO (optional)</p>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Meta Title</label>
            <input
              className="input-field"
              value={form.meta_title}
              onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Meta Description</label>
            <textarea
              rows={2}
              className="textarea-field"
              value={form.meta_description}
              onChange={(e) =>
                setForm({ ...form, meta_description: e.target.value })
              }
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Keywords</label>
            <input
              className="input-field"
              value={form.meta_keywords}
              onChange={(e) => setForm({ ...form, meta_keywords: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
            className="rounded"
          />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            className="rounded"
          />
          Featured on homepage
        </label>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Saving..." : postId ? "Update Article" : "Create Article"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
