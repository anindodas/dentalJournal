"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { staticPages, defaultPageSeo } from "@/lib/site";
import type { PageSeo } from "@/types/database";

type Props = {
  initial: PageSeo[];
};

export default function AdminSeoEditor({ initial }: Props) {
  const router = useRouter();
  const [pages, setPages] = useState(() =>
    staticPages.map((p) => {
      const existing = initial.find((s) => s.page_path === p.path);
      const fallback = defaultPageSeo[p.path];
      return {
        page_path: p.path,
        meta_title: existing?.meta_title || fallback?.title || "",
        meta_description: existing?.meta_description || fallback?.description || "",
        meta_keywords: existing?.meta_keywords || fallback?.keywords || "",
      };
    })
  );
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  function update(path: string, field: string, value: string) {
    setPages((prev) =>
      prev.map((p) => (p.page_path === path ? { ...p, [field]: value } : p))
    );
  }

  async function save(path: string) {
    const page = pages.find((p) => p.page_path === path);
    if (!page) return;
    setSaving(path);
    setMessage("");
    try {
      const res = await fetch("/api/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(page),
      });
      if (!res.ok) throw new Error("Failed to save");
      setMessage(`Saved SEO for ${path}`);
      router.refresh();
    } catch {
      setMessage("Failed to save. Check Supabase connection.");
    } finally {
      setSaving(null);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-primary">Page SEO</h1>
        <p className="text-muted-foreground">
          Edit meta title, description, and keywords for each page.
        </p>
      </div>

      {message && (
        <div className="mb-6 rounded-lg bg-secondary px-4 py-3 text-sm text-primary">
          {message}
        </div>
      )}

      <div className="space-y-6">
        {pages.map((page) => (
          <div key={page.page_path} className="card space-y-4">
            <h2 className="font-semibold text-primary">{page.page_path}</h2>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Meta Title</label>
              <input
                className="input-field"
                value={page.meta_title}
                onChange={(e) => update(page.page_path, "meta_title", e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Meta Description</label>
              <textarea
                rows={3}
                className="textarea-field"
                value={page.meta_description}
                onChange={(e) =>
                  update(page.page_path, "meta_description", e.target.value)
                }
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Keywords</label>
              <input
                className="input-field"
                value={page.meta_keywords}
                onChange={(e) => update(page.page_path, "meta_keywords", e.target.value)}
                placeholder="comma, separated, keywords"
              />
            </div>
            <button
              type="button"
              onClick={() => save(page.page_path)}
              disabled={saving === page.page_path}
              className="btn-primary"
            >
              {saving === page.page_path ? "Saving..." : "Save"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
