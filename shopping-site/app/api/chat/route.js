import { sampleProducts } from "@/lib/products";

const catalog = sampleProducts.map((p) => `${p.name} ($${p.price}): ${p.description}`).join("\n");

function localReply(message) {
  const lower = message.toLowerCase();
  const match = sampleProducts.find((p) => lower.includes(p.name.toLowerCase().split(" ")[0]));
  if (match) return `${match.name} is $${match.price}. ${match.description} It is a great fit if that matches what you need.`;
  if (/(cheap|budget|under|least)/.test(lower)) return "For a lower-cost pick, I’d start with the Focus Notebook ($18), then the Cloud Ceramic Mug ($24). Both are useful everyday gifts.";
  if (/(gift|present)/.test(lower)) return "The Everyday Tote feels special and practical, while the Cloud Ceramic Mug is a lovely easy gift. Tell me your budget and who it’s for and I’ll narrow it down.";
  if (/(home|desk|work)/.test(lower)) return "For a calmer workspace, pair the Arc Desk Lamp ($89) with the Focus Notebook ($18). The lamp has warm dimmable light for focused work.";
  return "I can help you compare products, find gifts, or build a cart. What are you shopping for and what’s your budget?";
}

export async function POST(request) {
  const { message } = await request.json();
  if (!message?.trim()) return Response.json({ error: "Please enter a question." }, { status: 400 });
  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        body: JSON.stringify({ model: "gpt-4.1-mini", input: `You are a concise shopping assistant. Only recommend from this catalog:\n${catalog}\n\nCustomer: ${message}` })
      });
      const data = await response.json();
      if (data.output_text) return Response.json({ reply: data.output_text, mode: "AI" });
    } catch { /* use local catalog assistant below */ }
  }
  return Response.json({ reply: localReply(message), mode: "catalog assistant" });
}
