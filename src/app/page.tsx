import type { Metadata } from "next";
import DentalJournalLanding2 from "@/components/landing/DentalJournalLanding2";
import { buildMetadata, organizationJsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ path: "/" });
}

export default function HomePage() {
  const jsonLd = organizationJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DentalJournalLanding2 />
    </>
  );
}
