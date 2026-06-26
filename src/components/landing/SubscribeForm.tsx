"use client";

import { useState } from "react";

export default function SubscribeForm({ className = "" }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to subscribe");
      setStatus("done");
      setMessage(data.duplicate ? "You're already subscribed!" : "You're subscribed. Welcome!");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "done") {
    return <p className="text-sm font-medium text-primary">{message}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col items-center gap-3 sm:flex-row ${className}`}>
      {status === "error" && (
        <p className="w-full text-center text-sm text-red-600 sm:order-last">{message}</p>
      )}
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="w-full max-w-xs rounded-full border border-foreground/15 bg-card px-5 py-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 sm:max-w-sm"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-primary px-8 py-4 text-sm font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "Subscribing..." : "Subscribe"}
      </button>
    </form>
  );
}
