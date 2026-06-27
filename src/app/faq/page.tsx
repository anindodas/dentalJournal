import type { Metadata } from "next";
import { buildMetadata, webPageJsonLd, faqJsonLd } from "@/lib/seo";
import ArticleFaqs from "@/components/ArticleFaqs";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ path: "/faq" });
}

const generalFaqs = [
  {
    question: "How often should I visit the dentist for a checkup?",
    answer: "For most children and adults, it is recommended to visit the dentist every six months for a professional cleaning and examination. Regular visits help detect oral health issues early when they are easiest to treat.",
  },
  {
    question: "What is the best routine for daily oral care?",
    answer: "A complete daily oral care routine includes brushing twice a day for two minutes with a fluoride toothpaste, flossing once a day to clean plaque from between teeth, and rinsing with an antimicrobial mouthwash.",
  },
  {
    question: "Are electric toothbrushes really better than manual ones?",
    answer: "Both electric and manual toothbrushes can be highly effective when used with proper technique. However, electric toothbrushes often provide better plaque removal, are easier for individuals with limited hand mobility, and feature built-in timers to ensure you brush for the full two minutes.",
  },
  {
    question: "How can I write or pitch an article for DentalJournal.online?",
    answer: "We welcome pitches from dentists, dental hygienists, oral care specialists, and experienced medical writers. You can submit your pitch or outline directly on our Write For Us page.",
  },
  {
    question: "Is the advice on DentalJournal.online a substitute for a dentist visit?",
    answer: "No. The articles and guides on our website are for educational and informational purposes only. They do not constitute medical or professional dental advice, diagnosis, or treatment. Always consult a qualified dentist regarding any oral health concerns.",
  },
];

export default function FaqPage() {
  const pageSchema = webPageJsonLd(
    "/faq",
    "FAQ | DentalJournal.online",
    "Frequently asked questions about dental care routines, toothbrush choices, and our blog publication standards."
  );
  
  const faqSchema = faqJsonLd(generalFaqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-16">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
          Support
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl">
          Frequently Asked Questions
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          Find answers to common questions about dental care routines, article contributions, and medical disclaimers.
        </p>

        <div className="mt-2">
          <ArticleFaqs faqs={generalFaqs} />
        </div>

        <div className="mt-12 rounded-xl bg-slate-50 border border-border p-6 text-center">
          <h3 className="font-serif text-lg font-semibold text-primary">Still have questions?</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            If you couldn&apos;t find what you were looking for, please contact our team directly.
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <Link href="/contact" className="btn-primary py-2 px-4 text-sm">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
