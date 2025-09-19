export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const payload = await req.json(); 
    console.log("Received callback:", payload);

    // Just echo back what we got
    res.status(200).json({ received: payload });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ error: "Failed to parse webhook" });
  }
}
