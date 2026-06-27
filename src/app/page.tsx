import type { Metadata } from "next";
import DentalJournalLanding2 from "@/components/landing/DentalJournalLanding2";
import { buildMetadata, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ path: "/" });
}

export default function HomePage() {
  const orgSchema = organizationJsonLd();
  const siteSchema = websiteJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
      />
      <DentalJournalLanding2 />
    </>
  );
}
