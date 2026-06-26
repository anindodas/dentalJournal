import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getPublishedPosts } from "@/lib/queries";
import PostCard from "@/components/PostCard";
import { getDisplayReads } from "@/lib/reads";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ path: "/blog" });
}

export default async function BlogPage() {
  let posts: Awaited<ReturnType<typeof getPublishedPosts>> = [];
  try {
    posts = await getPublishedPosts();
  } catch {
    // tables may not exist yet
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-16 xl:px-32">
      <div className="mb-12 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
          Articles
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl">
          Dental health reads worth your time
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          Practical guides, oral care tips, and expert advice — written in plain
          language for patients, parents, and curious readers.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No articles published yet. Check back soon.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
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
      )}
    </div>
  );
}
