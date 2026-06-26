import Link from "next/link";
import PostForm from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/posts" className="text-sm text-muted hover:text-primary">
          ← Back to Articles
        </Link>
        <h1 className="mt-2 font-serif text-3xl font-bold text-primary">
          New Article
        </h1>
      </div>
      <PostForm />
    </div>
  );
}
