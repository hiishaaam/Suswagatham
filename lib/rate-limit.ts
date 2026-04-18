/**
 * In-memory rate limiter for API routes.
 * 
 * Uses a sliding window approach: tracks request timestamps per key (IP address)
 * and rejects requests that exceed the configured limit within the window.
 * 
 * Note: This is per-process. In a multi-instance deployment (e.g. Vercel),
 * each serverless function has its own memory, so limits are per-instance.
 * For stricter enforcement, upgrade to Redis (e.g. @upstash/ratelimit).
 */

type RateLimitEntry = {
  timestamps: number[]
}

const store = new Map<string, RateLimitEntry>()

// Cleanup stale entries every 5 minutes to prevent memory leaks
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000

let lastCleanup = Date.now()

function cleanup(windowMs: number) {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return
  lastCleanup = now

  const cutoff = now - windowMs
  for (const [key, entry] of store.entries()) {
    entry.timestamps = entry.timestamps.filter(t => t > cutoff)
    if (entry.timestamps.length === 0) {
      store.delete(key)
    }
  }
}

export interface RateLimitConfig {
  /** Maximum number of requests allowed within the window */
  maxRequests: number
  /** Time window in milliseconds */
  windowMs: number
}

export interface RateLimitResult {
  allowed: boolean
  /** Requests remaining in the current window */
  remaining: number
  /** Unix timestamp (ms) when the window resets */
  resetAt: number
  /** Seconds until the client can retry (only set when blocked) */
  retryAfterSeconds?: number
}

/**
 * Check whether a request from `key` is allowed under the given rate limit.
 * 
 * @param key - Unique identifier for the requester (typically IP or token)
 * @param config - Rate limit configuration
 * @returns RateLimitResult indicating whether the request is allowed
 */
export function rateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const { maxRequests, windowMs } = config
  const now = Date.now()
  const windowStart = now - windowMs

  // Periodic cleanup
  cleanup(windowMs)

  // Get or create entry
  let entry = store.get(key)
  if (!entry) {
    entry = { timestamps: [] }
    store.set(key, entry)
  }

  // Remove timestamps outside the current window
  entry.timestamps = entry.timestamps.filter(t => t > windowStart)

  if (entry.timestamps.length >= maxRequests) {
    // Rate limited — find the oldest timestamp in the window to calculate retry-after
    const oldestInWindow = entry.timestamps[0]
    const resetAt = oldestInWindow + windowMs
    const retryAfterSeconds = Math.ceil((resetAt - now) / 1000)

    return {
      allowed: false,
      remaining: 0,
      resetAt,
      retryAfterSeconds: Math.max(1, retryAfterSeconds),
    }
  }

  // Allow the request
  entry.timestamps.push(now)

  return {
    allowed: true,
    remaining: maxRequests - entry.timestamps.length,
    resetAt: now + windowMs,
  }
}

/**
 * Extract client IP from a Request object.
 * Checks standard proxy headers first, falls back to a default.
 */
export function getClientIp(req: Request): string {
  const headers = new Headers(req.headers)
  
  // Vercel / Cloudflare / standard proxy headers
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  const realIp = headers.get('x-real-ip')
  if (realIp) {
    return realIp.trim()
  }

  // Fallback — in development this will be the same for all requests
  return '127.0.0.1'
}
