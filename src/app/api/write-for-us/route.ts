import { NextRequest, NextResponse } from "next/server";
import { createWriteForUsSubmission } from "@/lib/queries";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  topic: z.string().min(1),
  bio: z.string().optional(),
  sample_url: z.string().url().optional().or(z.literal("")),
  message: z.string().min(20),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    const submission = await createWriteForUsSubmission({
      ...data,
      bio: data.bio || undefined,
      sample_url: data.sample_url || undefined,
    });
    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}
