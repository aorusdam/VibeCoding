import { LOTM_CONTEXT, LOTM_SOURCE_URL } from "@/lib/lotm-context";

function systemPrompt() {
  return `You are a careful Lord of Mysteries novel guide. Answer only from the supplied knowledge base. Default to beginner-safe answers: avoid major plot revelations, hidden identities, late-volume outcomes, and Circle of Inevitability spoilers unless the user explicitly requests spoilers and supplies their reading progress. If the context does not establish an answer, state that you do not have enough reviewed source context and suggest the user check the source page. Keep answers concise, factual, and welcoming. Mention the source URL only when useful.\n\nSOURCE URL: ${LOTM_SOURCE_URL}\n\nKNOWLEDGE BASE:\n${LOTM_CONTEXT}`;
}

async function askOpenAI(message) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-4.1-mini", instructions: systemPrompt(), input: message })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || "OpenAI request failed.");
  return data.output_text;
}

async function askDeepSeek(message) {
  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}` },
    body: JSON.stringify({ model: process.env.DEEPSEEK_MODEL || "deepseek-chat", messages: [{ role: "system", content: systemPrompt() }, { role: "user", content: message }], temperature: 0.2 })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || "DeepSeek request failed.");
  return data.choices?.[0]?.message?.content;
}

export async function POST(request) {
  const { message } = await request.json();
  if (!message?.trim()) return Response.json({ error: "Enter a question first." }, { status: 400 });
  const provider = (process.env.AI_PROVIDER || "openai").toLowerCase();
  try {
    const reply = provider === "deepseek" ? await askDeepSeek(message) : await askOpenAI(message);
    if (!reply) throw new Error("The provider returned no answer.");
    return Response.json({ reply, source: LOTM_SOURCE_URL });
  } catch (error) {
    console.error("Lord of Mysteries assistant error", error);
    return Response.json({ error: `The ${provider === "deepseek" ? "DeepSeek" : "OpenAI"} assistant is not available. Add the required API key to .env.local and restart the server.` }, { status: 503 });
  }
}
