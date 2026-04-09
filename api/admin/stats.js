// Admin dashboard stats endpoint.
//
// Pulls live data from Mailchimp and aggregates it for the /admin page.
// Protected by the ADMIN_PASSWORD env var — sent as:
//   Authorization: Bearer <ADMIN_PASSWORD>
//
// Required Vercel env vars:
//   ADMIN_PASSWORD      — password the admin page sends in the Authorization header
//   MAILCHIMP_API_KEY   — Mailchimp API key (e.g. abcdef...-us16)
//   MAILCHIMP_LIST_ID   — audience (list) ID
//   MAILCHIMP_DC        — optional override; auto-detected from API key suffix
//
// Returns JSON shaped like:
//   {
//     ok: true,
//     ts: "...",
//     totals: { members, subscribed, unsubscribed, cleaned, pending, waitlist, ideaGenerator },
//     velocity: { last24h, last7d, last30d },
//     tagBreakdown: { tag: count, ... },
//     recent: [ { email, status, tags, joined } ... up to 25 ],
//     all:    [ { email, status, tags, joined } ... everyone, newest first ]
//   }

import crypto from "node:crypto";

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

function mailchimpAuth(apiKey) {
  return "Basic " + Buffer.from("anystring:" + apiKey).toString("base64");
}

export default async function handler(req, res) {
  // Prevent any caching of this sensitive endpoint.
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

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;
  if (!apiKey || !listId) {
    return res.status(503).json({
      error:
        "Mailchimp is not configured. Set MAILCHIMP_API_KEY and MAILCHIMP_LIST_ID in Vercel.",
    });
  }

  const dc =
    process.env.MAILCHIMP_DC ||
    (apiKey.includes("-") ? apiKey.split("-").pop() : null);
  if (!dc) {
    return res
      .status(503)
      .json({ error: "Could not determine Mailchimp data center from API key." });
  }

  const mcAuth = mailchimpAuth(apiKey);
  const base = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}`;

  try {
    // 1. List summary — member_count / unsubscribe_count / cleaned_count
    const listRes = await fetch(
      `${base}?fields=stats.member_count,stats.unsubscribe_count,stats.cleaned_count,date_created`,
      { headers: { Authorization: mcAuth } }
    );
    if (!listRes.ok) {
      const errTxt = await listRes.text().catch(() => "");
      console.error("admin/stats list fetch failed", listRes.status, errTxt);
      return res
        .status(502)
        .json({ error: "Could not load list info from Mailchimp." });
    }
    const listData = await listRes.json();

    // 2. Members — pull up to 1000, newest first
    const membersRes = await fetch(
      `${base}/members?count=1000&sort_field=timestamp_opt&sort_dir=DESC&fields=members.email_address,members.status,members.timestamp_opt,members.timestamp_signup,members.tags,total_items`,
      { headers: { Authorization: mcAuth } }
    );
    if (!membersRes.ok) {
      const errTxt = await membersRes.text().catch(() => "");
      console.error(
        "admin/stats members fetch failed",
        membersRes.status,
        errTxt
      );
      return res
        .status(502)
        .json({ error: "Could not load members from Mailchimp." });
    }
    const membersData = await membersRes.json();
    const members = Array.isArray(membersData.members)
      ? membersData.members
      : [];

    // 3. Aggregate
    const now = Date.now();
    const DAY = 86_400_000;
    const cutoff24 = now - DAY;
    const cutoff7 = now - 7 * DAY;
    const cutoff30 = now - 30 * DAY;

    let subscribed = 0;
    let unsubscribed = 0;
    let cleaned = 0;
    let pending = 0;
    let waitlistCount = 0;
    let ideaCount = 0;
    let newLast24 = 0;
    let newLast7 = 0;
    let newLast30 = 0;

    const tagBreakdown = {};
    const rows = [];

    for (const m of members) {
      const tags = Array.isArray(m.tags) ? m.tags.map((t) => t.name) : [];
      if (tags.includes("waitlist")) waitlistCount++;
      if (tags.includes("idea-generator")) ideaCount++;
      for (const t of tags) tagBreakdown[t] = (tagBreakdown[t] || 0) + 1;

      switch (m.status) {
        case "subscribed":
          subscribed++;
          break;
        case "unsubscribed":
          unsubscribed++;
          break;
        case "cleaned":
          cleaned++;
          break;
        case "pending":
          pending++;
          break;
        default:
          break;
      }

      const ts = m.timestamp_opt || m.timestamp_signup || null;
      const tsMs = ts ? Date.parse(ts) : NaN;
      if (!Number.isNaN(tsMs)) {
        if (tsMs > cutoff24) newLast24++;
        if (tsMs > cutoff7) newLast7++;
        if (tsMs > cutoff30) newLast30++;
      }

      rows.push({
        email: m.email_address,
        status: m.status,
        tags: tags.length ? tags.join(", ") : "—",
        joined: ts,
      });
    }

    const memberCount =
      (listData.stats && listData.stats.member_count) ?? subscribed;

    return res.status(200).json({
      ok: true,
      ts: new Date().toISOString(),
      totals: {
        members: memberCount,
        subscribed,
        unsubscribed:
          (listData.stats && listData.stats.unsubscribe_count) ?? unsubscribed,
        cleaned: (listData.stats && listData.stats.cleaned_count) ?? cleaned,
        pending,
        waitlist: waitlistCount,
        ideaGenerator: ideaCount,
        loaded: rows.length,
        totalInList: membersData.total_items ?? rows.length,
      },
      velocity: {
        last24h: newLast24,
        last7d: newLast7,
        last30d: newLast30,
      },
      tagBreakdown,
      recent: rows.slice(0, 25),
      all: rows,
      listCreated: listData.date_created || null,
    });
  } catch (err) {
    console.error("admin/stats unexpected error:", err);
    return res
      .status(502)
      .json({ error: "Unexpected error loading Mailchimp data." });
  }
}
