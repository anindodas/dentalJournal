import { NextRequest, NextResponse } from "next/server";
import {
  createPost,
  getAllPostsAdmin,
  getPublishedPosts,
} from "@/lib/queries";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const postSchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  author: z.string().min(1),
  category: z.string().default("Dental Health"),
  cover_image: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  meta_title: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable(),
  meta_keywords: z.string().optional().nullable(),
  reads: z.number().int().min(0).optional(),
  reads_per_day: z.number().int().min(0).optional(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const publishedOnly = searchParams.get("published") === "true";
  const session = await getSession();

  try {
    if (publishedOnly && !session) {
      const posts = await getPublishedPosts();
      return NextResponse.json(posts);
    }
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const posts = await getAllPostsAdmin();
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = postSchema.parse(body);
    const coverImage = data.cover_image ?? data.coverImage ?? null;

    let slug = slugify(data.title);
    const existing = await getAllPostsAdmin();
    if (existing.some((p) => p.slug === slug)) {
      slug = `${slug}-${Date.now()}`;
    }

    const post = await createPost({
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      author: data.author,
      category: data.category,
      cover_image: coverImage,
      published: data.published,
      featured: data.featured,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
      meta_keywords: data.meta_keywords,
      reads: data.reads,
      reads_per_day: data.reads_per_day,
      slug,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
