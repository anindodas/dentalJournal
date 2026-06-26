"use client";

import { useState } from "react";
import { CheckCircle, Mail } from "lucide-react";

export default function ContactForm() {
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to send message");
      setSent(true);
      form.reset();
    } catch {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="py-12 text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-accent" />
        <h2 className="mt-6 font-serif text-3xl">Message sent</h2>
        <p className="mt-4 text-muted-foreground">
          Thank you for reaching out. We&apos;ll get back to you within 2 business days.
        </p>
        <button onClick={() => setSent(false)} className="btn-primary mt-8">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 grid gap-6 sm:grid-cols-2">
        <div className="card">
          <h3 className="font-semibold">General inquiries</h3>
          <a
            href="mailto:hello@dentaljournal.online"
            className="mt-2 block text-sm text-muted-foreground hover:text-primary"
          >
            hello@dentaljournal.online
          </a>
        </div>
        <div className="card">
          <h3 className="font-semibold">Write for us</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Interested in contributing? Visit our{" "}
            <a href="/write-for-us" className="text-primary hover:underline">
              Write for Us
            </a>{" "}
            page.
          </p>
        </div>
      </div>

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
          <label className="mb-1.5 block text-sm font-medium">Subject *</label>
          <input name="subject" required className="input-field" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Message *</label>
          <textarea
            name="message"
            required
            minLength={10}
            rows={6}
            className="textarea-field"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </>
  );
}
