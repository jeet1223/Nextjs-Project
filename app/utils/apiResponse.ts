import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

/**
 * Standardized API response utilities
 * Ensures consistent error handling across all API routes
 */

export class ApiResponse {
  /**
   * Success response
   */
  static success<T>(data: T, status = 200) {
    return NextResponse.json(data, { status });
  }

  /**
   * Created response (201)
   */
  static created<T>(data: T) {
    return NextResponse.json(data, { status: 201 });
  }

  /**
   * Bad Request (400)
   */
  static badRequest(message: string, details?: unknown) {
    return NextResponse.json(
      { error: message, details },
      { status: 400 }
    );
  }

  /**
   * Unauthorized (401)
   */
  static unauthorized(message = 'Unauthorized') {
    return NextResponse.json(
      { error: message },
      { status: 401 }
    );
  }

  /**
   * Forbidden (403)
   */
  static forbidden(message = 'Forbidden') {
    return NextResponse.json(
      { error: message },
      { status: 403 }
    );
  }

  /**
   * Not Found (404)
   */
  static notFound(message = 'Resource not found') {
    return NextResponse.json(
      { error: message },
      { status: 404 }
    );
  }

  /**
   * Conflict (409)
   */
  static conflict(message: string) {
    return NextResponse.json(
      { error: message },
      { status: 409 }
    );
  }

  /**
   * Too Many Requests (429)
   */
  static tooManyRequests(message = 'Too many requests. Please try again later.') {
    return NextResponse.json(
      { error: message },
      { status: 429 }
    );
  }

  /**
   * Internal Server Error (500)
   */
  static internalError(message = 'Internal Server Error', logError?: unknown) {
    if (logError) {
      console.error('Internal Server Error:', logError);
    }
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }

  /**
   * Handle Zod validation errors
   */
  static validationError(error: ZodError) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      },
      { status: 400 }
    );
  }

  /**
   * Generic error handler
   */
  static handleError(error: unknown): NextResponse {
    if (error instanceof ZodError) {
      return this.validationError(error);
    }

    if (error instanceof Error) {
      // Don't expose internal error messages in production
      if (process.env.NODE_ENV === 'production') {
        return this.internalError(undefined, error);
      }
      return this.internalError(error.message, error);
    }

    return this.internalError();
  }
}

/**
 * Pagination response helper
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function createPaginationMeta(
  page: number,
  limit: number,
  total: number
): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Sanitize search input to prevent SQL injection
 */
export function sanitizeSearchInput(input: string): string {
  return input
    .trim()
    .replace(/[%_]/g, '\\$&') // Escape SQL wildcards
    .substring(0, 100); // Limit length
}

/**
 * Validate and parse pagination parameters
 */
export function parsePaginationParams(url: URL): { page: number; limit: number; offset: number } {
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '10', 10)));
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}
