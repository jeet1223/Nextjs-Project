import { NextResponse } from 'next/server';
import { db } from "@/db/client";
import { category } from "@/db/category";
import { eq, like, or, and, gte, lte } from "drizzle-orm";


export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const search = url.searchParams.get("search") || "";

    const offset = (page - 1) * limit;
    const whereCondition = search
      ? or(
          like(category.name, `%${search}%`),
          like(category.description, `%${search}%`)
        )
      : undefined;

    const categoryList = await db
      .select()
      .from(category)
      .where(whereCondition)
      .limit(limit)
      .offset(offset);

    const totalCountResult = await db
      .select()
      .from(category)
      .where(whereCondition);

    return NextResponse.json({
      category: categoryList,
      pagination: {
        page,
        limit,
        total: totalCountResult.length,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}


// GET product by ID
export async function GET_BY_ID(req: Request) {
  const urlParts = req.url.split('/');
  const id = urlParts.pop();

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: 'Invalid or missing product ID' }, { status: 400 });
  }

  try {
    const product = await db.select().from(category).where(eq(category.id, Number(id)));

    if (!product || product.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product[0]);  // Return the found product
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

// DELETE product by ID
export async function DELETE(req: Request) {
  const urlParts = req.url.split('/');
  const id = urlParts.pop();

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: 'Invalid or missing product ID' }, { status: 400 });
  }

  try {
    const deletedProduct = await db.delete(category).where(eq(category.id, Number(id)));

    if (!deletedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
// ADD product (POST)
export async function POST(req: Request) {
  try {
    const productData = await req.json();
    if (!productData.name || !productData.description) {
      return NextResponse.json({ error: 'Missing required fields (name, price, description)' }, { status: 400 });
    }

    const newProduct = await db.insert(category).values({
      name: productData.name,
      description: productData.description,
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}

// UPDATE product (PUT)
export async function PUT(req: Request) {
  const urlParts = req.url.split('/');
  const id = urlParts.pop();

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: 'Invalid or missing product ID' }, { status: 400 });
  }

  try {
    // Parse request body for updated product data
    const updatedProductData = await req.json();

    // Validate input data
    if (!updatedProductData.name || !updatedProductData.price || !updatedProductData.description) {
      return NextResponse.json({ error: 'Missing required fields (name, price, description)' }, { status: 400 });
    }

    // Update product in the database
    const updateResult = await db.update(category)
      .set({
        name: updatedProductData.name,
        description: updatedProductData.description,
      })
      .where(eq(category.id, Number(id)));

    if (updateResult.length) {
      return NextResponse.json({ error: 'Product not found or no changes made' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
