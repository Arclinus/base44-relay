export const config = {
  api: {
    bodyParser: true, // Vercel parses JSON automatically
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const payload = req.body;
    console.log("Received callback:", payload);

    const videoUrl = payload?.output?.url || payload?.url;

    // Forward payload to Base44 (or your test endpoint like webhook.site)
    const forwardRes = await fetch(process.env.BASE44_CALLBACK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: payload.status,
        videoUrl,
        originalPayload: payload,
      }),
    });

    if (!forwardRes.ok) {
      throw new Error(`Base44 responded with status ${forwardRes.status}`);
    }

    res.status(200).json({ ok: true, forwarded: true });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ error: "Failed to process and forward webhook" });
  }
}
