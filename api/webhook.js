export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const payload = req.body; // callback from provider
    console.log("Received callback:", payload);

    // Extract video URL if available
    const videoUrl = payload?.output?.url || payload?.url;

    // Forward to Base44
    const response = await fetch(process.env.BASE44_CALLBACK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: payload.status,
        videoUrl,
        originalPayload: payload, // keep full data if needed
      }),
    });

    if (!response.ok) {
      throw new Error(`Base44 responded with ${response.status}`);
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ error: "Failed to process webhook" });
  }
}
