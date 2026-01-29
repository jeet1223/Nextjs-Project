import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/db/client";
import { users } from "@/db/user";
import { eq } from "drizzle-orm";

// Validate JWT_SECRET exists
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
  try {
    // Get the refresh token from Authorization header or cookie
    const authHeader = req.headers.get('Authorization');
    const headerToken = authHeader ? authHeader.split(' ')[1] : null;
    const cookieToken = req.cookies.get('refresh_token')?.value;
    
    const refreshToken = headerToken || cookieToken;
    
    if (!refreshToken) {
      return NextResponse.json(
        { error: "Refresh token is missing" },
        { status: 400 }
      );
    }

    // Verify the refresh token
    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, JWT_SECRET);
    } catch (error: unknown) {
      return NextResponse.json(
        { error: "Invalid or expired refresh token" },
        { status: 401 }
      );
    }

    // Validate decoded payload
    if (!decoded || typeof decoded !== 'object' || !decoded.id) {
      return NextResponse.json(
        { error: "Invalid token payload" },
        { status: 401 }
      );
    }

    // Fetch the user from the database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.id));

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 401 }
      );
    }

    // Verify the refresh token matches the one in database
    if (user.refresh_token !== refreshToken) {
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // Create a new access token
    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Generate new refresh token (refresh token rotation)
    const newRefreshToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
    
    await db
      .update(users)
      .set({ refresh_token: newRefreshToken })
      .where(eq(users.id, user.id));

    const response = NextResponse.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });

    // Update refresh token cookie
    response.cookies.set({
      name: "refresh_token",
      value: newRefreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (err: unknown) {
    console.error("Error in refresh token handler:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
