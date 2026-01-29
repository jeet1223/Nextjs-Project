import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { users } from "@/db/user";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    // Get user ID from headers (set by middleware)
    const userId = req.headers.get('x-user-id');
    
    if (userId) {
      // Invalidate refresh token in database
      await db.update(users)
        .set({ refresh_token: null })
        .where(eq(users.id, parseInt(userId)));
    }

    const response = NextResponse.json({ message: "Logged out successfully" });
    
    // Clear refresh token cookie
    response.cookies.set({
      name: "refresh_token",
      value: "",
      httpOnly: true,
      path: "/",
      maxAge: 0,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (err: unknown) {
    console.error("Logout error:", err);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
