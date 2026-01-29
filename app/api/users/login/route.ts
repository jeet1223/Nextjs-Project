import bcrypt from "bcryptjs";
import { db } from "@/db/client";
import { users } from "@/db/user";
import { addresses } from "@/db/addresses";
import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { z } from "zod";

// Validate JWT_SECRET exists
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

const JWT_SECRET = process.env.JWT_SECRET;

// Input validation schemas
const LoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin"]).optional().default("user"),
});

const RegisterSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
  phone_number: z.string().min(7).max(20),
  role: z.enum(["user", "admin"]).optional().default("user"),
  status: z.boolean().optional().default(true),
  isNotification: z.boolean().optional().default(true),
  deviceToken: z.string().max(255).optional().default(""),
  deviceType: z.string().max(50).optional().default("web"),
  loginWith: z.string().max(50).optional().default("web"),
  image: z.string().max(255).optional().default(""),
  address: z.object({
    street: z.string().max(255).optional(),
    city: z.string().max(100).optional(),
    state: z.string().max(100).optional(),
    country: z.string().max(100).optional(),
    area: z.string().max(100).optional(),
    pincode: z.string().max(20).optional(),
    landmark: z.string().max(255).optional(),
  }),
});

// Rate limiting map (in production, use Redis)
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const attempts = loginAttempts.get(email);
  
  if (!attempts || now > attempts.resetAt) {
    loginAttempts.set(email, { count: 1, resetAt: now + 15 * 60 * 1000 }); // 15 minutes
    return true;
  }
  
  if (attempts.count >= 5) {
    return false; // Too many attempts
  }
  
  attempts.count++;
  return true;
}

function resetRateLimit(email: string): void {
  loginAttempts.delete(email);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Determine if this is a login or registration attempt
    const isLogin = !body.name; // Login doesn't have name field

    if (isLogin) {
      // Validate login input
      const validation = LoginSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json(
          { error: "Validation failed", details: validation.error.issues },
          { status: 400 }
        );
      }

      const { email, password, role } = validation.data;

      // Check rate limiting
      if (!checkRateLimit(email)) {
        return NextResponse.json(
          { error: "Too many login attempts. Please try again later." },
          { status: 429 }
        );
      }

      // Find user
      const [existingUser] = await db
        .select()
        .from(users)
        .where(and(eq(users.email, email), eq(users.role, role)));

      if (!existingUser) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      const hashedPassword = existingUser.password ?? "";
      if (!hashedPassword) {
        return NextResponse.json(
          { error: "Account error. Please contact support." },
          { status: 400 }
        );
      }

      const isPasswordValid = await bcrypt.compare(password, hashedPassword);
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      // Reset rate limit on successful login
      resetRateLimit(email);

      const accessToken = jwt.sign(
        { id: existingUser.id, email: existingUser.email, role: existingUser.role },
        JWT_SECRET,
        { expiresIn: "15m" }
      );

      const refresh_token = jwt.sign({ id: existingUser.id }, JWT_SECRET, { expiresIn: "7d" });
      await db.update(users).set({ refresh_token }).where(eq(users.id, existingUser.id));

      // Set httpOnly cookie for refresh token (more secure than sessionStorage)
      const response = NextResponse.json({
        message: "Login successful",
        user: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role,
        },
        accessToken,
        refresh_token,
        type: "login",
      });

      response.cookies.set({
        name: "refresh_token",
        value: refresh_token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
      });

      return response;
    } else {
      // Registration flow
      const validation = RegisterSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json(
          { error: "Validation failed", details: validation.error.issues },
          { status: 400 }
        );
      }

      const data = validation.data;

      // Check if user already exists
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, data.email));

      if (existingUser) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 409 }
        );
      }

      const hashedPassword = await bcrypt.hash(data.password, 12); // Increased from 10 to 12

      const [addressResult] = await db
        .insert(addresses)
        .values({
          street: data.address.street,
          city: data.address.city,
          state: data.address.state,
          country: data.address.country,
          area: data.address.area,
          pincode: data.address.pincode,
          landmark: data.address.landmark,
        })
        .$returningId();

      const addressId = addressResult.id;

      const userToInsert = {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        phone_number: data.phone_number,
        role: data.role,
        status: data.status,
        is_notification: data.isNotification,
        deviceToken: data.deviceToken,
        deviceType: data.deviceType,
        loginWith: data.loginWith,
        image: data.image,
        address_id: addressId,
      };

      const [insertResult] = await db.insert(users).values(userToInsert).$returningId();

      const accessToken = jwt.sign(
        { id: insertResult.id, email: data.email, role: data.role },
        JWT_SECRET,
        { expiresIn: "15m" }
      );

      const refresh_token = jwt.sign({ id: insertResult.id }, JWT_SECRET, { expiresIn: "7d" });
      await db.update(users).set({ refresh_token }).where(eq(users.id, insertResult.id));

      const response = NextResponse.json(
        {
          message: "User registered successfully",
          user: {
            id: insertResult.id,
            name: data.name,
            email: data.email,
            role: data.role,
          },
          accessToken,
          refresh_token,
          type: "register",
        },
        { status: 201 }
      );

      response.cookies.set({
        name: "refresh_token",
        value: refresh_token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
      });

      return response;
    }
  } catch (err: unknown) {
    console.error("API Error:", err);
    
    // Don't expose internal error details
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: err.issues },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
