import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata, webPageJsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ path: "/about" });
}

export default function AboutPage() {
  const jsonLd = webPageJsonLd(
    "/about",
    "About Us | DentalJournal.online",
    "Learn about DentalJournal.online — an independent blog offering dental care tips and hygienist advice."
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-16">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
        About us
      </p>
      <h1 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl">
        Dental health writing that actually helps
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
        DentalJournal.online is an independent dental health blog — not a research
        journal. We publish clear, practical articles for everyday readers.
      </p>

      <div className="mt-12 space-y-8">
        <section className="card">
          <h2 className="mb-4 font-serif text-2xl font-semibold">What we publish</h2>
          <p className="leading-relaxed text-muted-foreground">
            From brushing techniques and gum health to cosmetic dentistry and
            pediatric care, our articles translate dental knowledge into advice
            you can use at home and in the dentist&apos;s chair.
          </p>
        </section>

        <section className="card">
          <h2 className="mb-4 font-serif text-2xl font-semibold">Who writes for us</h2>
          <p className="leading-relaxed text-muted-foreground">
            Our contributors include dentists, hygienists, and health writers who
            care about accuracy and readability. Every article is reviewed for
            clarity before publication.
          </p>
        </section>

        <section className="card">
          <h2 className="mb-4 font-serif text-2xl font-semibold">Our standards</h2>
          <ul className="space-y-2 text-muted-foreground">
            {[
              "Plain language over jargon",
              "Evidence-informed, patient-friendly advice",
              "No scare tactics or sensational headlines",
              "Clear distinction between education and medical advice",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-wrap gap-4">
          <Link href="/blog" className="btn-primary">
            Browse Articles
          </Link>
          <Link href="/write-for-us" className="btn-secondary">
            Write for Us
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
