import type { MetadataRoute } from "next";
import { getAllPostSlugs } from "@/lib/queries";
import { siteConfig, staticPages } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${base}${page.path === "/" ? "" : page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  let postEntries: MetadataRoute.Sitemap = [];
  try {
    const slugs = await getAllPostSlugs();
    postEntries = slugs.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at || post.published_at || new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // tables may not exist yet
  }

  return [...staticEntries, ...postEntries];
}
