import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, User, ArrowLeft, Tag, Eye } from "lucide-react";
import { getPostBySlug } from "@/lib/queries";
import { buildMetadata, articleJsonLd, faqJsonLd } from "@/lib/seo";
import { formatDate, slugify } from "@/lib/utils";
import { getDisplayReads, formatReads } from "@/lib/reads";
import { siteConfig } from "@/lib/site";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import TableOfContents from "@/components/TableOfContents";
import ArticleFaqs from "@/components/ArticleFaqs";

type Props = { params: Promise<{ slug: string }> };

type TOCItem = {
  id: string;
  text: string;
  level: number;
};

function parseTOCAndContent(content: string): {
  toc: TOCItem[];
  html: string;
} {
  const toc: TOCItem[] = [];
  let html = content;
  let headingIndex = 0;

  // Find and replace <h2> and <h3> tags, injecting unique ids
  html = content.replace(/<h(2|3)([^>]*)>(.*?)<\/h\1>/gi, (match, levelStr, attrs, text) => {
    const level = parseInt(levelStr, 10);
    const cleanText = text.replace(/<[^>]*>/g, "").trim();
    const id = `heading-${slugify(cleanText)}-${headingIndex++}`;
    toc.push({ id, text: cleanText, level });
    
    if (!attrs.includes("id=")) {
      return `<h${level} id="${id}"${attrs}>${text}</h${level}>`;
    }
    return match;
  });

  return { toc, html };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article Not Found" };
  return buildMetadata({
    path: `/blog/${slug}`,
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    keywords: post.meta_keywords || undefined,
    image: post.cover_image || undefined,
    type: "article",
    publishedTime: post.published_at || undefined,
    author: post.author,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const jsonLd = articleJsonLd(post);
  const faqLd = faqJsonLd(post.faqs);
  const readCount = getDisplayReads(post);

  const { toc, html } = parseTOCAndContent(post.content);
  const showTOC = (post.has_toc ?? true) && toc.length > 0;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <ReadingProgressBar />

      <div className={`mx-auto px-4 py-8 sm:py-16 sm:px-6 lg:px-8 ${showTOC ? "max-w-6xl" : "max-w-3xl"}`}>
        <Link
          href="/blog"
          className="mb-6 sm:mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Articles
        </Link>

        <div className={showTOC ? "grid grid-cols-1 gap-12 lg:grid-cols-12" : ""}>
          {showTOC && (
            <aside className="lg:col-span-3 lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] overflow-y-auto hidden lg:block">
              <TableOfContents items={toc} />
            </aside>
          )}

          <div className={showTOC ? "lg:col-span-9 col-span-12" : ""}>
            <article className="max-w-3xl">
              {post.cover_image && (
                <div className="relative mb-6 sm:mb-10 aspect-[16/9] overflow-hidden rounded-2xl">
                  <Image
                    src={post.cover_image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 768px"
                  />
                </div>
              )}

              <header className="mb-6 sm:mb-10 border-b border-border pb-6 sm:pb-8">
                <div className="mb-4 flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 font-medium text-secondary-foreground">
                    <Tag className="h-3.5 w-3.5" />
                    {post.category}
                  </span>
                  {post.published_at && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {formatDate(post.published_at)}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye className="h-4 w-4" />
                    {formatReads(readCount)} reads
                  </span>
                </div>
                <h1 className="font-serif text-3xl leading-tight tracking-tight sm:text-4xl md:text-5xl text-primary">
                  {post.title}
                </h1>
                <p className="mt-4 sm:mt-5 text-base sm:text-lg leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
              </header>

              {/* Mobile Table of Contents Accordion */}
              {showTOC && (
                <div className="lg:hidden">
                  <TableOfContents items={toc} />
                </div>
              )}

              <div
                className="prose-content"
                dangerouslySetInnerHTML={{ __html: html }}
              />

              <ArticleFaqs faqs={post.faqs} />

              <footer className="mt-10 sm:mt-16 border-t border-border pt-8">
                <p className="text-sm text-muted-foreground">
                  Published on {siteConfig.name}
                  {post.published_at && ` · ${formatDate(post.published_at)}`}
                </p>
              </footer>
            </article>
          </div>
        </div>
      </div>
    </>
  );
}
