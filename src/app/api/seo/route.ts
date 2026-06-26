import { NextRequest, NextResponse } from "next/server";
import { getAllPageSeo, upsertPageSeo } from "@/lib/queries";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  page_path: z.string().min(1),
  meta_title: z.string().min(1),
  meta_description: z.string().min(1),
  meta_keywords: z.string().optional(),
});

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const pages = await getAllPageSeo();
    return NextResponse.json(pages);
  } catch {
    return NextResponse.json({ error: "Failed to fetch SEO settings" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = schema.parse(await request.json());
    const page = await upsertPageSeo(data.page_path, {
      meta_title: data.meta_title,
      meta_description: data.meta_description,
      meta_keywords: data.meta_keywords,
    });
    return NextResponse.json(page);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update SEO" }, { status: 500 });
  }
}
