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
  published_at: string;
  has_toc: boolean;
  faqs: { question: string; answer: string }[];
  slug: string;
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
    published_at: initial?.published_at || "",
    has_toc: initial?.has_toc ?? true,
    faqs: initial?.faqs || [],
    slug: initial?.slug || "",
  });

  const [faqJsonText, setFaqJsonText] = useState(JSON.stringify(initial?.faqs || [], null, 2));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    let parsedFaqs = [];
    try {
      const trimmed = faqJsonText.trim();
      if (trimmed) {
        parsedFaqs = JSON.parse(trimmed);
        if (!Array.isArray(parsedFaqs)) {
          throw new Error("FAQs must be a JSON array: [{\"question\": \"...\", \"answer\": \"...\"}]");
        }
        for (const item of parsedFaqs) {
          if (typeof item !== "object" || item === null || typeof item.question !== "string" || typeof item.answer !== "string") {
            throw new Error("Each FAQ item must have a 'question' and 'answer' string field.");
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid FAQs JSON format");
      setLoading(false);
      return;
    }

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
          published_at: form.published_at || null,
          slug: form.slug.trim() || null,
          faqs: parsedFaqs,
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

      <div>
        <label className="mb-1.5 block text-sm font-medium">Slug (optional)</label>
        <input
          className="input-field"
          value={form.slug}
          onChange={(e) =>
            setForm({
              ...form,
              slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, "-").replace(/-+/g, "-"),
            })
          }
          placeholder="e.g. customized-url-slug"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Optional. If left blank, it will be automatically generated from the title.
        </p>
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
            <label className="mb-1.5 block text-sm font-medium">Current read count</label>
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
              The number of reads shown on the article. If edited, it resets the daily growth to start from this new value.
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
              The rate at which the count automatically grows each day (default: 12/day).
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border p-4">
        <p className="mb-4 text-sm font-medium text-primary">Publication Options</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Published Date & Time</label>
            <input
              type="datetime-local"
              className="input-field"
              value={form.published_at ? new Date(form.published_at).toISOString().slice(0, 16) : ""}
              onChange={(e) => {
                const val = e.target.value;
                setForm({ ...form, published_at: val ? new Date(val).toISOString() : "" });
              }}
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Leave blank to set automatically when published.
            </p>
          </div>
          <div className="flex flex-col justify-end pb-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={form.has_toc}
                onChange={(e) => setForm({ ...form, has_toc: e.target.checked })}
                className="rounded"
              />
              Show Table of Contents
            </label>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Automatically builds a TOC from heading tags.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border p-4">
        <label className="mb-1 block text-sm font-medium text-primary">FAQs (JSON format)</label>
        <p className="mb-3 text-xs text-muted-foreground">
          Enter FAQs as a JSON array of objects. Example:
          <code className="block mt-1 p-2 bg-slate-50 border border-border rounded text-[10px] whitespace-pre font-mono">
{`[
  {
    "question": "What is the best way to clean teeth?",
    "answer": "Brush twice a day with fluoride toothpaste and floss daily."
  }
]`}
          </code>
        </p>
        <textarea
          rows={8}
          className="textarea-field font-mono text-xs"
          value={faqJsonText}
          onChange={(e) => setFaqJsonText(e.target.value)}
          placeholder="[]"
        />
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
