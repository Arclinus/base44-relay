export const config = {
  api: {
    bodyParser: true, // make sure Vercel parses JSON automatically
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // On Vercel, parsed JSON is available directly on req.body
    const payload = req.body;
    console.log("Received callback:", payload);

    res.status(200).json({ received: payload });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ error: "Failed to parse webhook" });
  }
}
