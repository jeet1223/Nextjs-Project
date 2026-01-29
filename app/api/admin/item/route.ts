import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { items } from "@/db/item";
import { category } from "@/db/category";
import { itemImages } from "@/db/itemImage";
import { eq, like, or, sql } from "drizzle-orm";
import fs from "fs";
import path from "path";
import slugify from "slugify";
import { z } from "zod";

// Allowed image MIME types and extensions
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 10;

// Validation schema for item creation
const ItemSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1).max(5000),
  price: z.number().positive(),
  discountPrice: z.number().min(0).optional(),
  categoryId: z.number().positive(),
  limitedItem: z.number().min(0).optional(),
  stock: z.boolean(),
  color: z.string().max(50).optional(),
  quantityName: z.string().max(100).optional(),
  tag: z.string().max(100).optional(),
});

function validateFileType(file: File): boolean {
  const ext = path.extname(file.name).toLowerCase();
  return ALLOWED_IMAGE_TYPES.includes(file.type) && ALLOWED_EXTENSIONS.includes(ext);
}

function sanitizeFilename(filename: string): string {
  // Remove dangerous characters and path traversal attempts
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.\.+/g, '_')
    .substring(0, 100);
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "10", 10)));
    const search = url.searchParams.get("search")?.trim() || "";
    const offset = (page - 1) * limit;

    let conditions;
    if (search) {
      // Sanitize search input
      const sanitizedSearch = search.replace(/[%_]/g, '\\$&');
      conditions = or(
        like(items.name, `%${sanitizedSearch}%`),
        like(items.description, `%${sanitizedSearch}%`)
      );
    }

    // Fetch items with category + images
    const itemListRaw = await db
      .select({
        id: items.id,
        name: items.name,
        description: items.description,
        price: items.price,
        discountPrice: items.discountPrice,
        created_at: items.created_at,
        tag: items.tag,
        color: items.color,
        quantityName: items.quantityName,
        stock: items.stock,
        categoryName: category.name,
        categoryId: category.id,
        limitedItem: items.limitedItem,
        imageUrl: itemImages.imageUrl,
      })
      .from(items)
      .leftJoin(category, eq(items.categoryId, category.id))
      .leftJoin(itemImages, eq(items.id, itemImages.itemId))
      .where(conditions)
      .limit(limit)
      .offset(offset);

    // Group images by item
    const itemsMap: Record<number, any> = {};
    for (const row of itemListRaw) {
      if (!itemsMap[row.id]) {
        itemsMap[row.id] = { ...row, images: [] };
      }
      if (row.imageUrl) {
        itemsMap[row.id].images.push(row.imageUrl);
      }
      delete itemsMap[row.id].imageUrl;
    }

    const itemList: any[] = Object.values(itemsMap);

    // Get total count
    const totalCountResult = await db
      .select({ count: sql<number>`COUNT(DISTINCT ${items.id})` })
      .from(items)
      .where(conditions);

    const totalCount = totalCountResult[0]?.count || 0;

    return NextResponse.json({
      items: itemList,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Extract and validate form data
    const itemData = {
      name: formData.get("name")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      price: Number(formData.get("price")) || 0,
      discountPrice: Number(formData.get("discountPrice")) || 0,
      categoryId: Number(formData.get("categoryId")) || 0,
      limitedItem: Number(formData.get("limitedItem")) || 0,
      stock: formData.get("in_stock") === "true",
      color: formData.get("color")?.toString() || "",
      quantityName: formData.get("quantityName")?.toString() || "",
      tag: formData.get("tag")?.toString() || "",
    };

    // Validate item data
    const validation = ItemSchema.safeParse(itemData);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.issues },
        { status: 400 }
      );
    }

    const validatedData = validation.data;

    // Handle file uploads
    const files = formData.getAll("images") as File[];

    if (files.length === 0) {
      return NextResponse.json(
        { error: "At least one image is required" },
        { status: 400 }
      );
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Maximum ${MAX_FILES} images allowed` },
        { status: 400 }
      );
    }

    // Validate all files first
    for (const file of files) {
      if (!validateFileType(file)) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.name}. Only JPEG, PNG, and WebP images are allowed.` },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File too large: ${file.name}. Maximum size is 5MB.` },
          { status: 400 }
        );
      }
    }

    // Slugify the name
    const slug = slugify(validatedData.name, { lower: true, strict: true });

    // Ensure uploads folder exists
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const imageUrls: string[] = [];

    // Save files
    for (const file of files) {
      const sanitizedFileName = sanitizeFilename(file.name);
      const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${sanitizedFileName}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      const filePath = path.join(uploadDir, uniqueFileName);

      await fs.promises.writeFile(filePath, buffer);
      imageUrls.push(`/uploads/${uniqueFileName}`);
    }

    // Insert item and images in transaction
    const item = await db.transaction(async (tx) => {
      const [newItem] = await tx
        .insert(items)
        .values({
          name: validatedData.name,
          description: validatedData.description,
          price: validatedData.price,
          discountPrice: validatedData.discountPrice,
          categoryId: validatedData.categoryId,
          limitedItem: validatedData.limitedItem,
          slug,
          stock: validatedData.stock,
          quantityName: validatedData.quantityName,
          tag: validatedData.tag,
          color: validatedData.color,
        })
        .$returningId();

      await tx.insert(itemImages).values(
        imageUrls.map((url) => ({ itemId: newItem.id, imageUrl: url }))
      );

      return newItem;
    });

    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    console.error("Error adding item:", err);
    
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.issues },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to add item" },
      { status: 500 }
    );
  }
}
