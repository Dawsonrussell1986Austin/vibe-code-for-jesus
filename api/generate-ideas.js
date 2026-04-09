// Vercel serverless function — generates 3 product ideas + marketing angles
// using the Vercel AI Gateway (Claude). Requires AI_GATEWAY_API_KEY env var
// in Vercel project settings (or run on Vercel where OIDC is automatic).
//
// Also persists every submission (problem + generated ideas) to Upstash Redis
// so the admin dashboard at /admin can review what people are asking for.
// If Upstash isn't configured yet (env vars missing), the handler logs the
// payload to stdout and continues — no failures, no downtime.

import { generateObject } from "ai";
import { z } from "zod";
import crypto from "node:crypto";
import { Redis } from "@upstash/redis";

const ideasSchema = z.object({
  ideas: z
    .array(
      z.object({
        name: z
          .string()
          .describe("A short, catchy product name (2-4 words)."),
        tagline: z
          .string()
          .describe("A one-line tagline (under 12 words)."),
        what_it_does: z
          .string()
          .describe(
            "2-3 sentences explaining what the product is and the specific problem it solves."
          ),
        build_first: z
          .string()
          .describe(
            "The single smallest version of this idea the user could ship in their first 3-hour build session."
          ),
        marketing: z.object({
          audience: z
            .string()
            .describe("Who specifically would buy or use this."),
          where_to_find_them: z
            .string()
            .describe(
              "Specific channels, communities, or places to reach this audience."
            ),
          the_hook: z
            .string()
            .describe(
              "A short, punchy line that would make this audience stop scrolling."
            ),
        }),
      })
    )
    .length(3),
});

const SYSTEM_PROMPT = `You are an idea generator for Christians who want to launch their first website, app, or online business after taking The Genesis Challenge — a 3-hour build session that takes total beginners from blank screen to launched.

When the user shares a problem from their daily life, your job is to give them THREE distinct, realistic product ideas that:
- A first-time builder could actually launch in a few hours (a simple website, web app, online storefront, or lightweight SaaS — no native mobile, no hardware, no heavy infrastructure)
- Solve a real, specific pain point — not vague platforms
- Could legitimately make money or serve a community
- Range in ambition: one tiny/safe, one medium, one bigger swing
- Honor a Christian worldview (hopeful, dignifying, never exploitative) without being preachy or only church-flavored

For each idea, also give a focused marketing angle: who would buy it, where to find those people online, and a hook that would stop them scrolling.

Important: Do NOT mention Claude, Claude Code, AI tools, frameworks, programming languages, or specific tech stacks in your output. Frame ideas in terms of what the product DOES for the user, not how it's built. The reader is a non-technical first-time builder — they care about the idea and the customer, not the technology.

Be specific, warm, and energizing. Avoid generic SaaS clichés.`;

// Model id routes through the Vercel AI Gateway. Swap freely
// (e.g. "anthropic/claude-sonnet-4-5", "anthropic/claude-opus-4") in your
// Vercel AI Gateway dashboard to whichever model you've enabled.
const MODEL_ID = process.env.AI_GATEWAY_MODEL || "anthropic/claude-sonnet-4";

// Upstash Redis keys for storing idea-generator submissions.
const KEY_LIST = "ideas:submissions";      // list of JSON records, newest first
const KEY_COUNT = "ideas:count";            // total submissions ever
const MAX_STORED = 1000;                    // keep last N submissions (trim after each push)

/**
 * Lazily create an Upstash Redis client from env vars. Returns null if the
 * integration isn't configured yet — keeps the idea generator working even
 * before the user has connected Upstash in the Vercel Marketplace.
 */
function getRedis() {
  const url =
    process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    return new Redis({ url, token });
  } catch (err) {
    console.error("ideas: Redis init failed", err);
    return null;
  }
}

/**
 * Persist one submission. Best-effort: never throws, never blocks the user.
 */
async function persistSubmission(record) {
  // Always log — this is our safety net if Redis isn't wired up yet, and it's
  // still useful for auditing via Vercel Runtime Logs.
  console.log(
    JSON.stringify({
      event: "idea_generated",
      id: record.id,
      ts: record.ts,
      problem_length: (record.problem || "").length,
      idea_names: (record.ideas || []).map((i) => i.name),
    })
  );

  const redis = getRedis();
  if (!redis) return { stored: false, reason: "redis-not-configured" };

  try {
    await redis.lpush(KEY_LIST, JSON.stringify(record));
    await redis.ltrim(KEY_LIST, 0, MAX_STORED - 1);
    await redis.incr(KEY_COUNT);
    return { stored: true };
  } catch (err) {
    console.error("ideas: Redis write failed", err);
    return { stored: false, reason: "redis-write-failed" };
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: "Invalid JSON body." });
    }
  }

  const problem = (body && typeof body.problem === "string"
    ? body.problem
    : ""
  ).trim();

  if (problem.length < 10) {
    return res.status(400).json({
      error:
        "Tell us a little more about the problem (at least 10 characters).",
    });
  }
  if (problem.length > 1000) {
    return res
      .status(400)
      .json({ error: "Please keep it under 1000 characters." });
  }

  try {
    const { object } = await generateObject({
      model: MODEL_ID,
      schema: ideasSchema,
      system: SYSTEM_PROMPT,
      prompt: `Here's the problem I run into:\n\n${problem}\n\nGive me three product ideas I could build in a 3-hour Claude Code session, with a marketing angle for each.`,
      maxOutputTokens: 2048,
      temperature: 0.8,
    });

    // Persist the submission so the admin dashboard can review what people
    // are typing in. Best-effort — never blocks the response to the user.
    const record = {
      id: crypto.randomUUID(),
      ts: new Date().toISOString(),
      problem,
      ideas: object.ideas,
    };
    persistSubmission(record).catch((err) =>
      console.error("ideas: persistSubmission threw", err)
    );

    return res.status(200).json({ ideas: object.ideas });
  } catch (err) {
    console.error("generate-ideas error:", err);
    const status = err && err.status ? err.status : 500;
    const msg =
      err && err.message
        ? err.message
        : "Something went wrong generating ideas.";
    return res.status(status).json({ error: msg });
  }
}
