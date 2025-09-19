export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Parse JSON from request
    const payload = await req.json(); 
    console.log("Received callback:", payload);

    const videoUrl = payload?.output?.url || payload?.url;

    // Forward to Base44
    const base44Res = await fetch(process.env.BASE44_CALLBACK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: payload.status,
        videoUrl,
        originalPayload: payload
      }),
    });

    if (!base44Res.ok) {
      throw new Error(`Base44 responded with ${base44Res.status}`);
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ error: "Failed to process webhook" });
  }
}
