import type { Metadata } from "next";
import { PenLine } from "lucide-react";
import WriteForUsForm from "@/components/WriteForUsForm";
import { buildMetadata, webPageJsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ path: "/write-for-us" });
}

export default function WriteForUsPage() {
  const jsonLd = webPageJsonLd(
    "/write-for-us",
    "Write For Us | DentalJournal.online",
    "Contribute dental health articles to DentalJournal.online. Submit your story idea and join our writer community."
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-16">
        <div className="mb-10">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary">
            <PenLine className="h-6 w-6" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            Contribute
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl">
            Write for us
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Share your dental health expertise with our readers. We welcome pitches
            from dentists, hygienists, and experienced health writers.
          </p>
        </div>

        <div className="mb-10 card">
          <h2 className="font-serif text-xl font-semibold">What we&apos;re looking for</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>• Original, unpublished articles (800–1,500 words)</li>
            <li>• Patient-friendly tone with accurate, evidence-informed content</li>
            <li>• Topics: oral hygiene, gum health, cosmetic dentistry, pediatric care, and more</li>
            <li>• No promotional or affiliate-heavy content</li>
          </ul>
        </div>

        <WriteForUsForm />
      </div>
    </>
  );
}
