import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ path: "/terms" });
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-16 animate-in fade-in duration-500">
      <div className="mb-10">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary">
          <FileText className="h-6 w-6" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
          Legal
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Last updated: June 27, 2026
        </p>
      </div>

      {/* Critical Medical Disclaimer Highlight */}
      <div className="mb-10 rounded-xl border border-destructive/20 bg-destructive/5 p-6 shadow-sm">
        <h2 className="font-serif text-xl font-semibold text-primary">Medical & Dental Disclaimer</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          <strong>IMPORTANT:</strong> All information published on DentalJournal.online is for educational and informational purposes only. It is not intended to be, and must not be taken as, professional medical or dental advice, diagnosis, or treatment. Always seek the advice of your dentist, physician, or other qualified health provider with any questions you may have regarding a dental or medical condition. Never disregard professional advice or delay in seeking it because of something you have read on this website.
        </p>
      </div>

      <div className="prose-content">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using DentalJournal.online (the &quot;Website&quot;), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Website.
        </p>

        <h2>2. Use of Content</h2>
        <p>
          All articles, guides, images, graphics, and other content published on the Website are the intellectual property of DentalJournal.online, unless otherwise stated.
        </p>
        <ul>
          <li>You may view, download, and print content from the Website for your personal, non-commercial use only.</li>
          <li>You must not republish, sell, rent, sub-license, duplicate, copy, or redistribute any material from the Website without our express written permission.</li>
        </ul>

        <h2>3. No Medical or Professional Relationship</h2>
        <p>
          Your use of this Website, including reading articles or contacting us via forms, does not create a dentist-patient relationship or any other professional health relationship. The Website does not provide medical services, prescribing, or clinical dental advice.
        </p>

        <h2>4. User Contributions & Submissions</h2>
        <p>
          If you submit a pitch or article (via the &quot;Write for Us&quot; section) or post comments, you grant DentalJournal.online a non-exclusive, royalty-free, perpetual, and worldwide license to use, reproduce, modify, adapt, publish, and translate such content.
        </p>
        <p>
          You agree that you will not submit any content that is defamatory, illegal, offensive, copyright-infringing, or contains promotional spam or affiliate links without authorization.
        </p>

        <h2>5. Disclaimer of Warranties</h2>
        <p>
          The Website and its content are provided on an &quot;as is&quot; and &quot;as available&quot; basis. While we strive to ensure that all information is accurate, up-to-date, and evidence-informed, DentalJournal.online makes no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the Website or the information contained within it.
        </p>

        <h2>6. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by applicable law, DentalJournal.online and its contributors shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your access to, use of, or inability to use the Website, or any errors or omissions in the content thereof.
        </p>

        <h2>7. External Links</h2>
        <p>
          Our Website may contain links to external third-party websites. These links are provided for convenience and informational purposes only. We have no control over the content, privacy policies, or practices of these external sites and accept no responsibility for them.
        </p>

        <h2>8. Modifications to Terms</h2>
        <p>
          We reserve the right to revise and update these Terms of Service at any time. Any changes will be posted here with an updated &quot;Last updated&quot; date. Continued use of the Website after changes are posted constitutes acceptance of those changes.
        </p>

        <h2>9. Governing Law</h2>
        <p>
          These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction in which the Website operator resides, without regard to its conflict of law provisions.
        </p>

        <h2>10. Contact Us</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us at: <a href="mailto:hello@dentaljournal.online">hello@dentaljournal.online</a>.
        </p>
      </div>
    </div>
  );
}
