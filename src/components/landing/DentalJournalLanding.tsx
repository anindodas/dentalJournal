import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";
import SubscribeForm from "@/components/landing/SubscribeForm";
import PostCard from "@/components/PostCard";
import LogoGrid from "@/components/landing/LogoGrid";
import {
  featuredInLogos,
  heroImage,
  trustedByLogos,
} from "@/lib/landing-data";
import { getFeaturedPosts, getPublishedPosts } from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import { getDisplayReads } from "@/lib/reads";

export default async function DentalJournalLanding() {
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

      {/* Hero */}
      <section className="grain relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pt-48 lg:pb-32">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-16 xl:px-32">
          <div className="lg:col-span-5">
            <div className="mb-8 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/55">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-primary" />
              Dental health blog · Updated weekly
            </div>

            <h1 className="font-serif text-5xl font-medium leading-[0.95] tracking-tight text-balance text-foreground sm:text-6xl lg:text-[5.5rem] xl:text-[6.5rem]">
              Smarter smiles start
              <span className="mt-1 block italic text-primary">
                with better reading.
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-foreground/70 sm:mt-10 sm:text-xl">
              DentalJournal.online publishes clear, practical articles about oral
              health, dental care, and everyday habits — written for patients,
              families, and curious minds.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
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

          <div className="relative lg:col-span-7">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-[0_20px_80px_-20px_rgba(30,78,66,0.35)] sm:aspect-[16/11] lg:aspect-[4/5]">
              <Image
                src={heroPost?.cover_image || heroImage}
                alt="Dental health blog"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              {heroPost && (
                <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-white/80">
                    Featured article
                  </p>
                  <Link href={`/blog/${heroPost.slug}`}>
                    <p className="mt-2 font-serif text-2xl leading-tight text-white hover:underline">
                      {heroPost.title}
                    </p>
                  </Link>
                </div>
              )}
            </div>

            {heroPost && (
              <div className="absolute -bottom-6 left-4 right-4 rounded-2xl border border-black/5 bg-white/90 p-6 shadow-[0_4px_32px_rgba(0,0,0,0.04)] backdrop-blur-xl sm:left-6 sm:right-auto sm:max-w-sm lg:-bottom-10">
                <p className="font-serif text-lg italic leading-snug text-foreground/80 line-clamp-3">
                  {heroPost.excerpt}
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-foreground/50">
                  {heroPost.author}
                  {heroPost.published_at && ` · ${formatDate(heroPost.published_at)}`}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <LogoGrid logos={featuredInLogos} label="Featured in" />
      <LogoGrid logos={trustedByLogos} label="Trusted by" />

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
