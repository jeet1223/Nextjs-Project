import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { items, category, itemImages } from "@/db/schema";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const deletedId = await params;
    console.log(deletedId,"kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
    const itemId = Number(deletedId.id);
    if (!itemId || isNaN(itemId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
  const itemList = await db
      .select({
        id: items.id,
        name: items.name,
        description: items.description,
        price: items.price,
        createdAt: items.created_at,
        categoryId: items.categoryId,
        categoryName: category.name,
        imageUrl: itemImages.imageUrl,
      })
      .from(items)
      .leftJoin(category, eq(items.categoryId, category.id))
      .leftJoin(itemImages, eq(items.id, itemImages.itemId))
      .where(eq(items.id, Number(itemId)));

    if (!itemList.length) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    const images = itemList
      .map((i) => i.imageUrl)
      .filter(Boolean);

    const {
      id,
      name,
      description,
      price,
      createdAt,
      categoryId,
      categoryName,
    } = itemList[0];
   return NextResponse.json({
      data: {
        id,
        name,
        description,
        price,
        createdAt,
        categoryId,
        categoryName,
        images,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}