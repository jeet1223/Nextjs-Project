import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { items } from "@/db/item";
import { category } from "@/db/category";
import { itemImages } from "@/db/itemImage";
import { eq, and } from "drizzle-orm";

export async function GET() {
  try {
    // Fetch items with category and images
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
      .where(and()); // You can add filters if needed

    // Group items by category
    const groupedItems: { categoryId: number; categoryName: string; items: any[] }[] = Object.values(
      itemList.reduce((acc: Record<number, { categoryId: number; categoryName: string; items: any[] }>, item) => {
        const { categoryId, categoryName, images, ...product } = item;

        // Handle potential null values
        const safeCategoryName = categoryName || 'Uncategorized';

        // Initialize category group
        if (!acc[categoryId]) {
          acc[categoryId] = {
            categoryId,
            categoryName: safeCategoryName,
            items: [],
          };
        }

        // Find if item already exists in category
        const existingItem = acc[categoryId].items.find(
          (i: { id: number }) => i.id === product.id
        );

        if (existingItem) {
          // Add image if exists
          if (images) existingItem.images.push(images);
        } else {
          acc[categoryId].items.push({
            ...product,
            images: images ? [images] : [],
          });
        }

        return acc;
      }, {})
    );

    return NextResponse.json({
      data: groupedItems,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}
