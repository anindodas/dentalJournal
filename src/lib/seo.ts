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
  updated_at?: string;
  created_at?: string;
  cover_image?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/favicon.png`,
      },
    },
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at || post.published_at || post.created_at,
    mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}`,
    image: post.cover_image
      ? [post.cover_image]
      : ["https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1200&h=630&q=80"],
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      "@id": `${siteConfig.url}/#logo`,
      url: `${siteConfig.url}/favicon.png`,
      caption: siteConfig.name,
    },
    image: {
      "@id": `${siteConfig.url}/#logo`
    },
    email: siteConfig.email,
    description: siteConfig.tagline,
    sameAs: [
      siteConfig.twitter ? `https://x.com/${siteConfig.twitter.replace("@", "")}` : ""
    ].filter(Boolean),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.tagline,
    publisher: {
      "@id": `${siteConfig.url}/#organization`
    },
    inLanguage: siteConfig.locale.replace("_", "-"),
  };
}

export function webPageJsonLd(path: string, name: string, description: string) {
  const url = `${siteConfig.url}${path === "/" ? "" : path}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}/#webpage`,
    url,
    name,
    description,
    isPartOf: {
      "@id": `${siteConfig.url}/#website`
    },
    about: {
      "@id": `${siteConfig.url}/#organization`
    },
    inLanguage: siteConfig.locale.replace("_", "-"),
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  if (!faqs || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
