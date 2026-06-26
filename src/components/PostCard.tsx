import Link from "next/link";
import { Calendar, User, ArrowRight, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { formatReads } from "@/lib/reads";

type PostCardProps = {
  post: {
    slug: string;
    title: string;
    excerpt: string;
    author: string;
    category: string;
    publishedAt: Date | null;
    readCount?: number;
  };
};

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="card group flex flex-col transition hover:shadow-md">
      <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="rounded-full bg-secondary px-2.5 py-1 font-medium text-secondary-foreground">
          {post.category}
        </span>
        {post.publishedAt && (
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(post.publishedAt)}
          </span>
        )}
        {post.readCount !== undefined && post.readCount > 0 && (
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {formatReads(post.readCount)} reads
          </span>
        )}
      </div>
      <h3 className="mb-2 font-serif text-xl font-semibold text-primary group-hover:text-accent">
        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
      </h3>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
        {post.excerpt}
      </p>
      <div className="flex items-center justify-between border-t border-border pt-4">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <User className="h-3.5 w-3.5" />
          {post.author}
        </span>
        <Link
          href={`/blog/${post.slug}`}
          className="flex items-center gap-1 text-sm font-medium text-accent hover:text-primary"
        >
          Read more
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
