import { NextRequest, NextResponse } from "next/server";
import { subscribeNewsletter } from "@/lib/queries";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const { email } = schema.parse(await request.json());
    const result = await subscribeNewsletter(email);
    return NextResponse.json({
      success: true,
      duplicate: result.duplicate,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
