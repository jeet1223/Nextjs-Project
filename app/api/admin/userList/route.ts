import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { users } from "@/db/user";
import { eq, like, or, and, gte, lte, sql, SQL } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "10", 10)));
    const search = url.searchParams.get("search")?.trim() || "";
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [eq(users.role, "user")];

    // Sanitize search input to prevent SQL injection
    if (search) {
      const sanitizedSearch = search.replace(/[%_]/g, '\\$&'); // Escape SQL wildcards
      const searchCondition = or(
        like(users.name, `%${sanitizedSearch}%`),
        like(users.email, `%${sanitizedSearch}%`),
        like(users.phone_number, `%${sanitizedSearch}%`)
      );
      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }

    // Validate date inputs
    if (from) {
      const fromDate = new Date(from + "T00:00:00");
      if (!isNaN(fromDate.getTime())) {
        conditions.push(gte(users.created_at, fromDate));
      }
    }

    if (to) {
      const toDate = new Date(to + "T23:59:59");
      if (!isNaN(toDate.getTime())) {
        conditions.push(lte(users.created_at, toDate));
      }
    }

    // Select only necessary fields, exclude sensitive data
    const userList = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone_number: users.phone_number,
        role: users.role,
        status: users.status,
        is_notification: users.is_notification,
        deviceType: users.deviceType,
        image: users.image,
        address_id: users.address_id,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users)
      .where(and(...conditions))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(users)
      .where(and(...conditions));

    const totalCount = totalCountResult[0]?.count || 0;

    return NextResponse.json({
      users: userList,
      pagination: { 
        page, 
        limit, 
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
