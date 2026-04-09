// Admin endpoint — returns stored Idea Generator submissions from Upstash Redis.
//
// Protected by the same ADMIN_PASSWORD env var as /api/admin/stats.
//   Authorization: Bearer <ADMIN_PASSWORD>
//
// Requires Upstash Redis to be connected to the project via the Vercel
// Marketplace integration. If Upstash isn't set up yet, returns a helpful
// 503 with setup instructions instead of a cryptic error.

import crypto from "node:crypto";
import { Redis } from "@upstash/redis";

const KEY_LIST = "ideas:submissions";
const KEY_COUNT = "ideas:count";

function timingSafeEqualStr(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ab.length !== bb.length) return false;
  try {
    return crypto.timingSafeEqual(ab, bb);
  } catch {
    return false;
  }
}

function getRedis() {
  const url =
    process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    return new Redis({ url, token });
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.setHeader("Pragma", "no-cache");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const adminPw = process.env.ADMIN_PASSWORD;
  if (!adminPw) {
    return res.status(503).json({
      error:
        "Admin not configured. Set ADMIN_PASSWORD in Vercel → Project → Settings → Environment Variables, then redeploy.",
    });
  }

  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : "";
  if (!token || !timingSafeEqualStr(token, adminPw)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const redis = getRedis();
  if (!redis) {
    // Not an error — it's a "not set up yet" signal the dashboard can show nicely.
    return res.status(200).json({
      ok: true,
      configured: false,
      setupInstructions:
        "Connect Upstash Redis via Vercel → Storage → Marketplace → Redis, then redeploy.",
      count: 0,
      submissions: [],
    });
  }

  // Query params: ?limit=50 (default 50, max 500)
  const url = new URL(req.url || "/", "http://x");
  let limit = parseInt(url.searchParams.get("limit") || "50", 10);
  if (!Number.isFinite(limit) || limit < 1) limit = 50;
  if (limit > 500) limit = 500;

  try {
    const [rawList, count] = await Promise.all([
      redis.lrange(KEY_LIST, 0, limit - 1),
      redis.get(KEY_COUNT),
    ]);

    const submissions = (rawList || [])
      .map((entry) => {
        // Upstash Redis client auto-parses JSON on some clients; handle both.
        if (typeof entry === "string") {
          try { return JSON.parse(entry); } catch { return null; }
        }
        if (entry && typeof entry === "object") return entry;
        return null;
      })
      .filter(Boolean);

    return res.status(200).json({
      ok: true,
      configured: true,
      ts: new Date().toISOString(),
      count: Number(count) || submissions.length,
      returned: submissions.length,
      submissions,
    });
  } catch (err) {
    console.error("admin/ideas Redis read failed", err);
    return res.status(502).json({
      error: "Could not read submissions from Redis.",
    });
  }
}
