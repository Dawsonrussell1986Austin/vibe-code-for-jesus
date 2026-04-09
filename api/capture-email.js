// Vercel serverless function — captures email addresses from any signup form
// on the site (waitlist + idea-generator unlock gate) and pushes them to
// Mailchimp.
//
// Required Vercel env vars:
//   MAILCHIMP_API_KEY   — your Mailchimp API key (e.g. abcdef...-us16)
//   MAILCHIMP_LIST_ID   — the audience (list) ID to subscribe to
//   MAILCHIMP_DC        — optional override for the data center; auto-detected
//                         from the API key suffix if omitted
//
// If MAILCHIMP_API_KEY is not set the function still validates and logs the
// email so the page works locally / in preview without secrets.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const url = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`;
  const auth = "Basic " + Buffer.from("anystring:" + apiKey).toString("base64");

  try {
    const mcRes = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },
      body: JSON.stringify({
        email_address: email,
        status: "subscribed",
        tags: [source],
      }),
    });

    if (mcRes.ok) {
      return res.status(200).json({ ok: true, mailchimp: "subscribed" });
    }

    const data = await mcRes.json().catch(() => ({}));
    // Treat "already a list member" as a soft success — they're already in.
    if (
      mcRes.status === 400 &&
      typeof data.title === "string" &&
      data.title.toLowerCase().includes("member exists")
    ) {
      return res.status(200).json({ ok: true, mailchimp: "already_member" });
    }

    console.error(
      JSON.stringify({
        event: "mailchimp_error",
        status: mcRes.status,
        title: data.title,
        detail: data.detail,
      })
    );
    return res
      .status(502)
      .json({ error: "Could not save your email. Please try again." });
  } catch (err) {
    console.error("MAILCHIMP request failed:", err);
    return res
      .status(502)
      .json({ error: "Could not save your email. Please try again." });
  }
}
