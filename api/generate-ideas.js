// Vercel serverless function — generates 3 product ideas + marketing angles
// using the Vercel AI Gateway (Claude). Requires AI_GATEWAY_API_KEY env var
// in Vercel project settings (or run on Vercel where OIDC is automatic).

import { generateObject } from "ai";
import { z } from "zod";

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

const SYSTEM_PROMPT = `You are an idea generator for Christians who want to build their first website, app, or online business with Claude Code in a 3-hour build session.

When the user shares a problem from their daily life, your job is to give them THREE distinct, realistic product ideas that:
- They could actually build in a few hours with Claude Code (no big infrastructure, no native mobile, no hardware)
- Solve a real, specific pain point — not vague platforms
- Could legitimately make money or serve a community
- Range in ambition: one tiny/safe, one medium, one bigger swing
- Honor a Christian worldview (hopeful, dignifying, never exploitative) without being preachy or only church-flavored

For each idea, also give a focused marketing angle: who would buy it, where to find those people online, and a hook that would stop them scrolling.

Be specific, warm, and energizing. Avoid generic SaaS clichés.`;

// Model id routes through the Vercel AI Gateway. Swap freely
// (e.g. "anthropic/claude-sonnet-4-5", "anthropic/claude-opus-4") in your
// Vercel AI Gateway dashboard to whichever model you've enabled.
const MODEL_ID = process.env.AI_GATEWAY_MODEL || "anthropic/claude-sonnet-4";

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
