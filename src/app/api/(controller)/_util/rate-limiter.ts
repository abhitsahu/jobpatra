import { NextResponse } from 'next/server';

/**
 * Simple in-memory rate limiter for serverless environments.
 *
 * Tracks request counts per IP within a sliding window.
 * In production you'd replace this with Redis (e.g. Upstash)
 * for multi-instance support. This is sufficient for MVP.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 60 seconds to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}, 60 * 1000).unref();

interface RateLimitOptions {
  /** Maximum requests allowed in the window */
  maxRequests: number;
  /** Window duration in seconds */
  windowSeconds: number;
}

/**
 * Check rate limit for a given identifier (usually IP address).
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = { maxRequests: 5, windowSeconds: 60 },
): NextResponse | null {
  const now = Date.now();
  const windowMs = options.windowSeconds * 1000;
  const entry = store.get(identifier);

  if (!entry || now > entry.resetAt) {
    // First request or window expired — start fresh
    store.set(identifier, { count: 1, resetAt: now + windowMs });
    return null;
  }

  if (entry.count >= options.maxRequests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return NextResponse.json(
      {
        success: false,
        message: 'Too many requests. Please try again later.',
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(options.maxRequests),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(entry.resetAt),
        },
      },
    );
  }

  entry.count++;
  return null;
}

/**
 * Extract client IP from request headers.
 * Works with Vercel, Cloudflare, and standard proxies.
 */
export function getClientIp(request: Request): string {
  const headers = new Headers(request.headers);
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') ||
    '127.0.0.1'
  );
}
