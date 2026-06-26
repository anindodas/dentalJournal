import type { Metadata } from "next";
import { Mail } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ path: "/contact" });
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-16">
      <div className="mb-10">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary">
          <Mail className="h-6 w-6" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
          Contact
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl">
          Get in touch
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Questions, feedback, or partnership ideas? We&apos;d love to hear from you.
        </p>
      </div>

      <ContactForm />
    </div>
  );
}
