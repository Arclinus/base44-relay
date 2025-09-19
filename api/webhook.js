export const config = {
  api: {
    bodyParser: true, // Let Vercel parse JSON automatically
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Receive full Shotstack payload
    const payload = req.body;
    console.log("Received callback:", payload);

    // Forward the payload *exactly as it came in* to Base44
    const forwardRes = await fetch(process.env.BASE44_CALLBACK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
