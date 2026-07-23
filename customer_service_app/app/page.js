"use client";
import { useState } from "react";
import Link from "next/link";
import { LOTM_SUGGESTIONS, LOTM_SOURCE_URL } from "@/lib/lotm-context";

export default function LordOfMysteriesChat() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", content: "Welcome, seeker. I can explain the novel’s setting, Klein Moretti, Beyonders, Pathways, and Sequences—with spoilers kept light by default." }]);
  async function ask(question) {
    if (!question.trim() || loading) return;
    setMessages((current) => [...current, { role: "user", content: question }]); setMessage(""); setLoading(true);
    try { const response = await fetch("/api/lotm-chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: question }) }); const data = await response.json(); setMessages((current) => [...current, { role: "assistant", content: data.reply || data.error }]); }
    catch { setMessages((current) => [...current, { role: "assistant", content: "I could not reach the assistant. Please try again." }]); }
    finally { setLoading(false); }
  }
  function submit(event) { event.preventDefault(); ask(message); }
  return <main className="lotm-page"><header className="lotm-header"><Link href="/" className="brand">mysteries guide</Link><a href={LOTM_SOURCE_URL} target="_blank" rel="noreferrer">Source overview ↗</a></header><section className="lotm-hero"><p className="eyebrow">Lord of Mysteries guide</p><h1>Ask carefully.<br /><i>Some knowledge bites back.</i></h1><p>A spoiler-conscious reading companion for the world of Klein Moretti, Beyonders, and the Pathways.</p></section><section className="lotm-chat-shell"><aside><p className="eyebrow">Try asking</p>{LOTM_SUGGESTIONS.map((suggestion) => <button key={suggestion} onClick={() => ask(suggestion)}>{suggestion}<span>→</span></button>)}<p className="source-note">Grounded in a reviewed summary of the <a href={LOTM_SOURCE_URL} target="_blank" rel="noreferrer">Lord of Mysteries wiki overview</a>. Configure an LLM API key to answer questions.</p></aside><div className="lotm-conversation"><div className="lotm-messages">{messages.map((item, index) => <article className={item.role} key={index}>{item.content}</article>)}{loading && <article className="assistant typing">Consulting the mist…</article>}</div><form onSubmit={submit}><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask a spoiler-safe question…" aria-label="Lord of Mysteries question"/><button type="submit" disabled={loading}>Ask <span>→</span></button></form></div></section></main>;
}
