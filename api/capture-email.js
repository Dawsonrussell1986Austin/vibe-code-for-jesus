// Vercel serverless function — captures email addresses from any signup form
// on the site (waitlist + idea-generator unlock gate) and pushes them to
// Mailchimp.
//
// Behaviour: "add or update and always tag".
//   1. PUT /lists/{id}/members/{md5(email)} with status_if_new="subscribed"
//      — creates the member if new, no-op for existing subscribers (we
//      deliberately don't change status, so already-unsubscribed people
//      stay unsubscribed).
//   2. POST /lists/{id}/members/{md5(email)}/tags to apply the source tag
//      (e.g. "waitlist", "idea-generator"). This fires whether the contact
//      was new or pre-existing, so previously-captured leads still get
//      correctly tagged when they re-engage from itwasverygood.com.
//
// Required Vercel env vars:
//   MAILCHIMP_API_KEY   — Mailchimp API key (e.g. abcdef...-us16)
//   MAILCHIMP_LIST_ID   — audience (list) ID
//   MAILCHIMP_DC        — optional override; auto-detected from API key suffix
//
// If MAILCHIMP_API_KEY / MAILCHIMP_LIST_ID are not set the function still
// validates and logs the email so the page works locally / in preview
// without secrets.

import crypto from "node:crypto";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function subscriberHash(email) {
  return crypto.createHash("md5").update(email.trim().toLowerCase()).digest("hex");
}

function mailchimpAuth(apiKey) {
  return "Basic " + Buffer.from("anystring:" + apiKey).toString("base64");
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

  const email = (body && typeof body.email === "string" ? body.email : "")
    .trim()
    .toLowerCase();
  const source = (body && typeof body.source === "string"
    ? body.source
    : "unknown"
  ).slice(0, 64);

  if (!email || !EMAIL_RE.test(email)) {
    return res
      .status(400)
      .json({ error: "Please enter a valid email address." });
  }

  // Always log the capture so it shows up in `vercel logs` even if Mailchimp
  // is not configured (useful for local + preview).
  console.log(
    JSON.stringify({
      event: "email_captured",
      source,
      email,
      ts: new Date().toISOString(),
    })
  );

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;

  if (!apiKey || !listId) {
    // Not configured yet — accept the email so the UX still works.
    return res.status(200).json({ ok: true, mailchimp: "skipped" });
  }

  const dc =
    process.env.MAILCHIMP_DC ||
    (apiKey.includes("-") ? apiKey.split("-").pop() : null);
  if (!dc) {
    console.error("MAILCHIMP: could not determine data center from API key");
    return res
      .status(500)
      .json({ error: "Mailchimp not configured correctly." });
  }

  const auth = mailchimpAuth(apiKey);
  const hash = subscriberHash(email);
  const base = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members/${hash}`;

  try {
    // 1. Upsert the member — status_if_new only sets "subscribed" for NEW
    //    contacts, so anyone who previously unsubscribed stays unsubscribed
    //    (compliance-friendly).
    const upsertRes = await fetch(base, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },
      body: JSON.stringify({
        email_address: email,
        status_if_new: "subscribed",
      }),
    });

    let upsertData = {};
    try {
      upsertData = await upsertRes.json();
    } catch {}

    if (!upsertRes.ok) {
      console.error(
        JSON.stringify({
          event: "mailchimp_upsert_error",
          status: upsertRes.status,
          title: upsertData.title,
          detail: upsertData.detail,
        })
      );
      return res
        .status(502)
        .json({ error: "Could not save your email. Please try again." });
    }

    // 2. Apply the source tag. Works for both brand-new and pre-existing
    //    contacts — Mailchimp's /members/{hash}/tags endpoint is idempotent.
    const tagRes = await fetch(`${base}/tags`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },
      body: JSON.stringify({
        tags: [{ name: source, status: "active" }],
      }),
    });

    if (!tagRes.ok && tagRes.status !== 204) {
      // Tag failure is non-fatal — the contact is already upserted, so we
      // log and still report success to the client.
      const tagData = await tagRes.json().catch(() => ({}));
      console.error(
        JSON.stringify({
          event: "mailchimp_tag_error",
          status: tagRes.status,
          title: tagData.title,
          detail: tagData.detail,
        })
      );
    }

    const state =
      upsertData.status === "subscribed" ? "subscribed" : upsertData.status || "upserted";
    return res.status(200).json({ ok: true, mailchimp: state });
  } catch (err) {
    console.error("MAILCHIMP request failed:", err);
    return res
      .status(502)
      .json({ error: "Could not save your email. Please try again." });
  }
}
