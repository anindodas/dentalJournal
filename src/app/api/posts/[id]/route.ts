import { NextRequest, NextResponse } from "next/server";
import {
  deletePost,
  getPostByIdAdmin,
  getPostBySlug,
  updatePost,
} from "@/lib/queries";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const postSchema = z.object({
  title: z.string().min(1).optional(),
  excerpt: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  author: z.string().min(1).optional(),
  category: z.string().optional(),
  cover_image: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
  meta_title: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable(),
  meta_keywords: z.string().optional().nullable(),
  reads: z.number().int().min(0).optional(),
  reads_per_day: z.number().int().min(0).optional(),
  published_at: z.string().optional().nullable(),
  has_toc: z.boolean().optional(),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
  slug: z.string().optional().nullable(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();

  try {
    let post = await getPostByIdAdmin(id);
    if (!post) {
      post = await getPostBySlug(id);
    }
    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (!post.published && !session) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const data = postSchema.parse(body);

    const existing = await getPostByIdAdmin(id);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { slug, ...otherData } = data;
    const update: Parameters<typeof updatePost>[1] = { ...otherData };
    if (data.cover_image !== undefined || data.coverImage !== undefined) {
      update.cover_image = data.cover_image ?? data.coverImage ?? null;
    }
    delete (update as Record<string, unknown>).coverImage;

    if (slug !== undefined) {
      update.slug = slug ? slugify(slug) : (data.title ? slugify(data.title) : slugify(existing.title));
    } else if (data.title && data.title !== existing.title) {
      update.slug = slugify(data.title);
    }

    const post = await updatePost(id, update);
    return NextResponse.json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await deletePost(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
