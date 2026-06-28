"use client";

import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SubscribeModal({ isOpen, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#0c0f0a]/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Container to center the modal content */}
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 md:p-10">
        
        {/* Modal Card */}
        <div className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-background border border-foreground/5 p-6 sm:p-10 md:p-12 shadow-2xl transition-all duration-300 transform scale-100 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 sm:right-6 sm:top-6 rounded-full p-2 text-foreground/50 hover:bg-foreground/5 hover:text-foreground transition-all duration-200"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>

          {status === "done" ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Check className="h-6 w-6" />
              </div>
              <p className="font-serif text-2xl font-bold text-foreground">
                Thank you!
              </p>
              <p className="mt-2 text-sm text-foreground/60 max-w-sm">
                {message}
              </p>
              <button
                onClick={onClose}
                className="mt-6 rounded-full bg-[#1a3d31] hover:bg-[#112921] text-white px-8 py-3 text-sm font-medium transition duration-200"
              >
                Continue reading
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              {/* Header label */}
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                The DentalJournal Dispatch
              </p>

              {/* Main title */}
              <h3 className="mt-3 font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground text-center leading-tight">
                One helpful email.<br className="hidden sm:inline" /> Every Sunday.
              </h3>

              {/* Description */}
              <p className="mt-4 text-center text-sm sm:text-base text-foreground/75 leading-relaxed max-w-md">
                Oral care tips, new articles, and practical dental advice — straight to your inbox.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-8 w-full">
                <div className="flex flex-col items-center gap-3 sm:flex-row">
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === "loading"}
                    className="w-full rounded-full border border-foreground/10 bg-muted/30 px-5 py-3.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full sm:w-auto rounded-full bg-[#1a3d31] hover:bg-[#112921] text-white px-8 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
                  >
                    {status === "loading" ? "Subscribing..." : "Subscribe"}
                  </button>
                </div>

                {status === "error" && (
                  <p className="mt-3 text-center text-xs font-medium text-red-600">
                    {message}
                  </p>
                )}
              </form>

              {/* Footer subtext */}
              <p className="mt-6 text-center text-[11px] sm:text-xs text-foreground/45">
                No spam. Unsubscribe in one click. We respect your inbox.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
