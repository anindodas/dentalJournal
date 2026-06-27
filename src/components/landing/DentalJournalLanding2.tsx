import Link from "next/link";
import { ArrowRight } from "lucide-react";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";
import SubscribeForm from "@/components/landing/SubscribeForm";
import PostCard from "@/components/PostCard";
import {
  featuredInLogos,
  trustedByLogos,
} from "@/lib/landing-data";
import { getFeaturedPosts, getPublishedPosts } from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import { getDisplayReads } from "@/lib/reads";


export default async function DentalJournalLanding2() {
  let latestPosts: Awaited<ReturnType<typeof getPublishedPosts>> = [];
  let featuredPosts: Awaited<ReturnType<typeof getFeaturedPosts>> = [];

  try {
    [latestPosts, featuredPosts] = await Promise.all([
      getPublishedPosts(6),
      getFeaturedPosts(1),
    ]);
  } catch {
    // Supabase tables may not be initialized yet
  }

  const heroPost = featuredPosts[0];

  return (
    <div className="min-h-screen bg-background">
      <LandingNav />

      {/* Redesigned Imageless Hero */}
      <section className="grain relative overflow-hidden bg-gradient-to-b from-secondary/40 via-background to-background pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-24">
        {/* Decorative ambient gradient blobs */}
        <div className="pointer-events-none absolute top-1/4 left-[10%] h-72 w-72 rounded-full bg-primary/5 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-10 right-[10%] h-96 w-96 rounded-full bg-accent/15 blur-[120px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-16 xl:px-32">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
            
            {/* Left Column: Heading and intro */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 border border-primary/10 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.28em] text-primary animate-fade-in-up">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-primary" />
                Dental health blog · Updated weekly
              </div>

              <h1 className="font-serif text-5xl font-medium leading-[0.95] tracking-tight text-balance text-foreground sm:text-6xl lg:text-[4.5rem] xl:text-[5.5rem] animate-fade-in-up animation-delay-150">
                Smarter smiles start
                <span className="mt-1 block italic text-primary">
                  with better reading.
                </span>
              </h1>

              <p className="max-w-xl text-lg leading-relaxed text-foreground/70 sm:text-xl animate-fade-in-up animation-delay-300">
                DentalJournal.online publishes clear, practical articles about oral
                health, dental care, and everyday habits — written for patients,
                families, and curious minds.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 animate-fade-in-up animation-delay-300">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Read latest articles
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="#dispatch"
                  className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-7 py-3.5 text-sm font-medium text-foreground/80 transition-all duration-300 hover:border-primary hover:text-primary"
                >
                  Subscribe — it&apos;s free
                </Link>
              </div>
            </div>

            {/* Right Column: Premium text-only editorial card */}
            <div className="lg:col-span-5 relative animate-fade-in-up animation-delay-300">
              {heroPost ? (
                <div className="relative rounded-3xl border border-primary/10 bg-card p-8 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.06)] hover:shadow-[0_30px_70px_-10px_rgba(30,78,66,0.12)] transition duration-300 hover:border-primary/20">
                  <div className="absolute top-0 right-8 transform -translate-y-1/2">
                    <span className="font-serif text-[7rem] leading-none text-secondary select-none font-bold opacity-70">
                      “
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                      Spotlight Article
                    </span>
                    <Link href={`/blog/${heroPost.slug}`} className="group block">
                      <h2 className="font-serif text-3xl font-bold leading-tight text-foreground group-hover:text-primary hover:underline transition duration-200">
                        {heroPost.title}
                      </h2>
                    </Link>
                    <p className="text-base text-foreground/75 leading-relaxed font-sans line-clamp-4">
                      {heroPost.excerpt}
                    </p>
                    <div className="pt-4 border-t border-foreground/5 flex items-center justify-between">
                      <div className="text-xs tracking-[0.1em] text-foreground/50">
                        <span className="font-semibold text-foreground/70">{heroPost.author}</span>
                        {heroPost.published_at && ` · ${formatDate(heroPost.published_at)}`}
                      </div>
                      <Link 
                        href={`/blog/${heroPost.slug}`} 
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-accent transition"
                      >
                        Read Post <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-3xl border border-primary/10 bg-card p-8 shadow-sm">
                  <span className="font-serif text-2xl text-foreground/70">Welcome to DentalJournal</span>
                  <p className="mt-4 text-sm text-foreground/60">Subscribe to our newsletter or explore our articles to keep your oral hygiene in top shape.</p>
                </div>
              )}
            </div>

          </div>

          {/* Featured In strip */}
          <div className="mt-20 border-t border-foreground/10 pt-10 animate-fade-in-up animation-delay-300">
            <p className="mb-8 text-center text-[10px] font-medium uppercase tracking-[0.36em] text-foreground/40">
              As featured in
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14 lg:gap-x-16 px-4">
              {featuredInLogos.map((logo) => (
                <div
                  key={logo.name}
                  className="shrink-0 flex items-center justify-center"
                  style={{ height: "32px" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.src}
                    alt={logo.name}
                    style={{ height: "32px", width: "auto", maxWidth: "140px" }}
                    className="object-contain opacity-45 grayscale hover:opacity-90 hover:grayscale-0 transition-all duration-300"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Trusted By — clean badge grid */}
      <section className="border-y border-foreground/8 bg-muted/20 py-14 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-16">
          <p className="mb-10 text-center text-[10px] font-medium uppercase tracking-[0.36em] text-foreground/40">
            Trusted by leading dental organisations
          </p>
          {/* Top row: 4 logos */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-8 sm:gap-x-12">
            {trustedByLogos.slice(0, 4).map((logo) => (
              <div
                key={logo.name}
                className="shrink-0 flex items-center justify-center"
                style={{ height: "52px" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.src}
                  alt={logo.name}
                  style={{ height: "52px", width: "auto", maxWidth: "220px" }}
                  className="object-contain opacity-50 grayscale hover:opacity-95 hover:grayscale-0 transition-all duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          {/* Bottom row: remaining logos centred */}
          {trustedByLogos.length > 4 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-8 sm:gap-x-12">
              {trustedByLogos.slice(4).map((logo) => (
                <div
                  key={logo.name}
                  className="shrink-0 flex items-center justify-center"
                  style={{ height: "52px" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.src}
                    alt={logo.name}
                    style={{ height: "52px", width: "auto", maxWidth: "220px" }}
                    className="object-contain opacity-50 grayscale hover:opacity-95 hover:grayscale-0 transition-all duration-300"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Readers' Recommendations Section */}
      <section className="bg-muted/40 py-20 sm:py-28 border-y border-foreground/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-16 xl:px-32">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              Community Voices
            </p>
            <h2 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl">
              Recommended by readers
            </h2>
            <p className="mt-4 text-foreground/60">
              Here is what our readers say about how our articles helped them make better dental decisions.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                quote: "The review on periodontal regeneration helped me understand the options for treating my gum recession. It explained biomaterials in a way that made sense.",
                author: "Sarah Jenkins",
                role: "Patient & Reader",
                articleTitle: "Periodontal Regeneration: Current Evidence and Future Directions",
                articleSlug: "periodontal-regeneration-evidence"
              },
              {
                quote: "I was curious about how dental implants are planned digitally, and this article broke down the CBCT-guided process beautifully. Informative and reassuring.",
                author: "David Chen",
                role: "Dental Implant Patient",
                articleTitle: "Digital Workflow Integration in Implant Planning",
                articleSlug: "digital-workflow-implant-planning"
              },
              {
                quote: "As a clinician, I share these articles with my patients. The review on minimally invasive dentistry is a fantastic educational resource.",
                author: "Dr. Elena Rostova",
                role: "General Dentist",
                articleTitle: "Advances in Minimally Invasive Restorative Dentistry",
                articleSlug: "advances-minimally-invasive-restorative-dentistry"
              }
            ].map((rec, idx) => (
              <div key={idx} className="card flex flex-col justify-between hover:shadow-md transition duration-300 border-primary/5 bg-background">
                <div className="space-y-4">
                  <div className="flex gap-1 text-primary">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-base">★</span>
                    ))}
                  </div>
                  <p className="italic text-foreground/80 leading-relaxed font-serif text-lg">
                    “{rec.quote}”
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-foreground/5 space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">{rec.author}</h4>
                    <p className="text-xs text-foreground/50">{rec.role}</p>
                  </div>
                  <div className="rounded-lg bg-secondary/35 p-3 text-xs flex flex-col gap-1">
                    <span className="font-medium text-primary uppercase tracking-wider text-[9px]">Recommended article</span>
                    <Link href={`/blog/${rec.articleSlug}`} className="font-serif text-sm font-semibold hover:underline text-foreground leading-snug">
                      {rec.articleTitle}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest articles */}
      {latestPosts.length > 0 && (
        <section className="py-20 sm:py-28 lg:py-36">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-16 xl:px-32">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                  Latest articles
                </p>
                <h2 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl">
                  Fresh reads for healthier smiles
                </h2>
              </div>
              <Link href="/blog" className="text-sm font-medium text-primary hover:text-accent">
                View all articles →
              </Link>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={{
                    slug: post.slug,
                    title: post.title,
                    excerpt: post.excerpt,
                    author: post.author,
                    category: post.category,
                    publishedAt: post.published_at ? new Date(post.published_at) : null,
                    readCount: getDisplayReads(post),
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-muted py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl">
            Want to write for us?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-foreground/70">
            Share your dental health expertise with thousands of readers. We welcome
            dentists, hygienists, and health writers.
          </p>
          <Link
            href="/write-for-us"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Write for Us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section id="dispatch" className="py-20 sm:py-28 lg:py-36">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
            The DentalJournal Dispatch
          </p>
          <h2 className="mt-5 font-serif text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            One helpful email. Every Sunday.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-foreground/70">
            Oral care tips, new articles, and practical dental advice — straight to
            your inbox.
          </p>
          <div className="mt-10">
            <SubscribeForm />
          </div>
          <p className="mt-5 text-xs text-foreground/50">
            No spam. Unsubscribe in one click. We respect your inbox.
          </p>
        </div>
      </section>

      <LandingFooter latestPosts={latestPosts} />
    </div>
  );
}
