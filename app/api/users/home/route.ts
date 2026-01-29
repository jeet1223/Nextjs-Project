import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { items } from "@/db/item";
import { category } from "@/db/category";
import { itemImages } from "@/db/itemImage";
import { eq, and } from "drizzle-orm";

function dailyShuffle<T>(array: T[]): T[] {
  const seed = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  return array
    .map((value, index) => ({ value, sort: (index + hash) % array.length }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export async function GET() {
  try {
    const itemList = await db
      .select({
        id: items.id,
        name: items.name,
        description: items.description,
        price: items.price,
        createdAt: items.created_at,
        categoryId: items.categoryId,
        categoryName: category.name,
        images: itemImages.imageUrl,
      })
      .from(items)
      .leftJoin(category, eq(items.categoryId, category.id))
      .leftJoin(itemImages, eq(items.id, itemImages.itemId))
      .where(and()); // optional filters

    const groupedItems: { categoryId: number; categoryName: string; items: any[] }[] = Object.values(
      itemList.reduce((acc: Record<number, { categoryId: number; categoryName: string; items: any[] }>, item) => {
        const { categoryId, categoryName, images, ...product } = item;

        // Handle potential null values
        const safeCategoryName = categoryName || 'Uncategorized';

        if (!acc[categoryId]) {
          acc[categoryId] = { categoryId, categoryName: safeCategoryName, items: [] };
        }

        const existingItem = acc[categoryId].items.find(
          (i: { id: number }) => i.id === product.id
        );

        if (existingItem) {
          if (images) existingItem.images.push(images);
        } else {
          acc[categoryId].items.push({ ...product, images: images ? [images] : [] });
        }

        return acc;
      }, {})
    );

    const finalItems = groupedItems.map((category) => ({
      ...category,
      items: dailyShuffle(category.items).slice(0, 5), // take only 5 per category
    }));

    return NextResponse.json({ data: finalItems });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}
