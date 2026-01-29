import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { cmsContent } from "@/db/content";
import { eq, like, or } from "drizzle-orm";

export async function POST(req: Request) {
  const { type, html } = await req.json();

  if (!type || !html) {
    return NextResponse.json({ error: "Missing type or html" }, { status: 400 });
  }

  await db
    .insert(cmsContent)
    .values({
      id: type, // unique key
      type,
      html,
    })
    .onDuplicateKeyUpdate({ // this is the key part
      set: {
        html, // update existing html
        updatedAt: new Date(), // update timestamp
      },
    });

  return NextResponse.json({ success: true });
}


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  if (!type) {
    return NextResponse.json({ error: "Type is required" }, { status: 400 });
  }

  const result = await db
    .select()
    .from(cmsContent)
    .where(eq(cmsContent.type, type))
    .limit(1);

  return NextResponse.json({
    html: result[0]?.html || "",
  });
}
