import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { cmsContent } from "@/db/content";
import { eq, like, or } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // Extract 'type' from the query params
    let cmsList;
    if (type) {
      cmsList = await db
        .select({
          id: cmsContent.id,
          type: cmsContent.type,
          html: cmsContent.html,
        })
        .from(cmsContent)
        .where(eq(cmsContent.type,type));
    } else {
      cmsList = await db
        .select({
          id: cmsContent.id,
          type: cmsContent.type,
          html: cmsContent.html,
        })
        .from(cmsContent);
    }

    return NextResponse.json({
      data: cmsList,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}
