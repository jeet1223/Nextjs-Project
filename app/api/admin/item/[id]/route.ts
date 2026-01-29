import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { items } from "@/db/item";
import { category } from "@/db/category";
import { itemImages } from "@/db/itemImage";
import { eq, like, or } from "drizzle-orm";
import fs from "fs";
import path from "path";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const deletedId = await params;
    const id = Number(deletedId.id);
    if (!id || isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    await db.delete(items).where(eq(items.id, id));
    return NextResponse.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}


export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const editId = await params;
  console.log(editId,"llllll")
  const id = Number(editId.id);

  if (!id) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  try {
    // Parse the form data from the request
    const formData = await req.formData();
    const name = formData.get("name")?.toString();
    const description = formData.get("description")?.toString();
    const price = Number(formData.get("price"));
    const discountPrice = Number(formData.get("discountPrice") || 0);
    const tag = formData.get("tag")?.toString();
    const color = formData.get("color")?.toString();
    const quantityName = formData.get("quantityName")?.toString();
   const stock = formData.get("in_stock") === "true" ? true : false;
    const limitedItem = Number(formData.get("limitedItem"))
    const categoryId = Number(formData.get("categoryId"));

    // ✅ EXISTING IMAGES (VERY IMPORTANT)
    const existingImages = formData.getAll("existingImages[]") as string[];

    // ✅ NEW UPLOADED FILES
    const files = formData.getAll("images") as File[];

    if (!name || !description || !price || !categoryId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    /* ---------------- FILE UPLOAD ---------------- */
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const newImageUrls: string[] = [];

    for (const file of files) {
      if (!file || file.size === 0) continue;

      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);

      await fs.promises.writeFile(filePath, buffer);
      newImageUrls.push(`/uploads/${fileName}`);
    }

    // ✅ FINAL IMAGE LIST = KEPT + NEW
    const finalImages = [...existingImages, ...newImageUrls];

    /* ---------------- DB TRANSACTION ---------------- */
    await db.transaction(async (tx) => {
      // Update item
      await tx
        .update(items)
        .set({ name, description, price, discountPrice, categoryId, tag,color, stock, limitedItem,quantityName})
        .where(eq(items.id, id));

      // Replace images safely
      await tx.delete(itemImages).where(eq(itemImages.itemId, id));

      if (finalImages.length > 0) {
        await tx.insert(itemImages).values(
          finalImages.map((url) => ({
            itemId: id,
            imageUrl: url,
          }))
        );
      }
    });

    return NextResponse.json({ message: "Item updated successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

