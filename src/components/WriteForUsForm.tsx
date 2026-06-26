"use client";

import { useState } from "react";
import { CheckCircle, PenLine } from "lucide-react";

export default function WriteForUsForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/write-for-us", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to submit");
      }
      setSent(true);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="py-12 text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-accent" />
        <h2 className="mt-6 font-serif text-3xl">Submission received</h2>
        <p className="mt-4 text-muted-foreground">
          Thanks for your interest! Our editorial team will review your pitch and
          respond within 5 business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Name *</label>
          <input name="name" required className="input-field" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Email *</label>
          <input name="email" type="email" required className="input-field" />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Article topic *</label>
        <input
          name="topic"
          required
          className="input-field"
          placeholder="e.g. How to choose an electric toothbrush"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Short bio</label>
        <textarea
          name="bio"
          rows={3}
          className="textarea-field"
          placeholder="Your credentials or writing background"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Sample writing URL</label>
        <input
          name="sample_url"
          type="url"
          className="input-field"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Pitch *</label>
        <textarea
          name="message"
          required
          minLength={20}
          rows={6}
          className="textarea-field"
          placeholder="Tell us about your article idea, target audience, and key points..."
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Submitting..." : "Submit Pitch"}
      </button>
    </form>
  );
}
