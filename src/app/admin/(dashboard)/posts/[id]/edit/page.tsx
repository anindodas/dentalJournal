import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostByIdAdmin } from "@/lib/queries";
import PostForm from "@/components/admin/PostForm";
import { getDisplayReads } from "@/lib/reads";

type Props = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const post = await getPostByIdAdmin(id);
  if (!post) notFound();

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/posts" className="text-sm text-muted-foreground hover:text-primary">
          ← Back to Articles
        </Link>
        <h1 className="mt-2 font-serif text-3xl font-bold text-primary">
          Edit Article
        </h1>
      </div>
      <PostForm
        postId={post.id}
        initial={{
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          author: post.author,
          category: post.category,
          cover_image: post.cover_image || "",
          published: post.published,
          featured: post.featured,
          meta_title: post.meta_title || "",
          meta_description: post.meta_description || "",
          meta_keywords: post.meta_keywords || "",
          reads: getDisplayReads(post),
          reads_per_day: post.reads_per_day ?? 12,
          published_at: post.published_at || "",
          has_toc: post.has_toc,
          faqs: post.faqs,
        }}
      />
    </div>
  );
}
