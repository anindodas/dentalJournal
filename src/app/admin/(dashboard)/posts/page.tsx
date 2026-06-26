import { getAllPostsAdmin } from "@/lib/queries";
import AdminPostsList from "@/components/admin/AdminPostsList";

export default async function AdminPostsPage() {
  let posts: Awaited<ReturnType<typeof getAllPostsAdmin>> = [];
  try {
    posts = await getAllPostsAdmin();
  } catch {
    // tables may not exist yet
  }

  return (
    <AdminPostsList
      posts={posts.map((p) => ({
        id: p.id,
        title: p.title,
        author: p.author,
        category: p.category,
        published: p.published,
        featured: p.featured,
        publishedAt: p.published_at,
        slug: p.slug,
      }))}
    />
  );
}
