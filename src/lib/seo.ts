import type { Metadata } from "next";
import { getPageSeo } from "./queries";
import { defaultPageSeo, siteConfig } from "./site";

type SeoOptions = {
  path: string;
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  author?: string;
  noIndex?: boolean;
};

export async function buildMetadata(options: SeoOptions): Promise<Metadata> {
  const dbSeo = await getPageSeo(options.path).catch(() => null);
  const fallback = defaultPageSeo[options.path];

  const title =
    options.title ||
    dbSeo?.meta_title ||
    fallback?.title ||
    siteConfig.name;
  const description =
    options.description ||
    dbSeo?.meta_description ||
    fallback?.description ||
    siteConfig.tagline;
  const keywords =
    options.keywords ||
    dbSeo?.meta_keywords ||
    fallback?.keywords ||
    "";
  const url = `${siteConfig.url}${options.path === "/" ? "" : options.path}`;
  const image =
    options.image ||
    "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1200&h=630&q=80";

  return {
    title,
    description,
    keywords: keywords.split(",").map((k) => k.trim()).filter(Boolean),
    metadataBase: new URL(siteConfig.url),
    alternates: { canonical: url },
    robots: options.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      type: options.type || "website",
      locale: siteConfig.locale,
      url,
      siteName: siteConfig.name,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      ...(options.type === "article" && options.publishedTime
        ? { publishedTime: options.publishedTime }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.twitter,
      title,
      description,
      images: [image],
    },
  };
}

export function articleJsonLd(post: {
  title: string;
  excerpt: string;
  slug: string;
  author: string;
  published_at: string | null;
  cover_image?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    datePublished: post.published_at,
    mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}`,
    ...(post.cover_image ? { image: post.cover_image } : {}),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    description: siteConfig.tagline,
  };
}
