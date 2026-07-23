"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export default function Storefront() {
  const [products, setProducts] = useState([]); const [filter, setFilter] = useState("All");
  const [cart, setCart] = useState([]); const [chatOpen, setChatOpen] = useState(false); const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([{ role: "assistant", content: "Hi — I’m here to help you find the right thing. What are you shopping for?" }]);
  useEffect(() => { fetch("/api/products").then(r => r.json()).then(d => setProducts(d.products)); }, []);
  const categories = ["All", ...new Set(products.map(p => p.category))];
  const shown = filter === "All" ? products : products.filter(p => p.category === filter);
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const add = (product) => setCart((current) => [...current, product]);
  async function send(e) { e.preventDefault(); if (!message.trim()) return; const prompt = message; setMessages(m => [...m, { role: "user", content: prompt }]); setMessage("");
    const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: prompt }) }); const data = await response.json(); setMessages(m => [...m, { role: "assistant", content: data.reply || "I’m sorry, please try that again." }]); }
  return <main>
    <header><Link href="/" className="brand">cartwise</Link><nav><a href="#shop">Shop</a><Link href="/tutorial">How it works</Link><button className="cart-link" onClick={() => document.getElementById("cart")?.scrollIntoView({ behavior: "smooth" })}>Bag <b>{cart.length}</b></button></nav></header>
    <section className="hero"><div><p className="eyebrow">Everyday, considered</p><h1>Useful things.<br /><i>Beautifully simple.</i></h1><p className="lede">A thoughtful collection for the small rituals that make a day feel better.</p><a className="button dark" href="#shop">Shop the collection <span>→</span></a></div><div className="hero-art"><div className="orb one"/><div className="orb two"/><span>good things<br />for daily life</span></div></section>
    <section id="shop" className="collection"><div className="section-top"><div><p className="eyebrow">The collection</p><h2>Made for everyday.</h2></div><div className="filters">{categories.map(c => <button key={c} onClick={() => setFilter(c)} className={filter === c ? "active" : ""}>{c}</button>)}</div></div>
      <div className="products">{shown.map(p => <article className="product" key={p.id}><div className="product-art" style={{ background: p.accent }}><img src={p.image} alt={p.name} /><span aria-hidden="true">{p.icon}</span></div><div className="product-copy"><div><p>{p.category}</p><h3>{p.name}</h3></div><strong>{money.format(p.price)}</strong></div><p className="description">{p.description}</p><button className="add" onClick={() => add(p)}>Add to cart <span>+</span></button></article>)}</div>
    </section>
    <section className="service"><p className="eyebrow">Need a hand?</p><h2>Shopping should feel<br />more human.</h2><p>Tell us who you’re buying for, your budget, or what you need. Our product assistant will point you in the right direction.</p><button className="button pale" onClick={() => setChatOpen(true)}>Ask Cartwise <span>↗</span></button></section>
    <section id="cart" className="cart"><div><p className="eyebrow">Your bag</p><h2>{cart.length ? `${cart.length} item${cart.length > 1 ? "s" : ""}, ready when you are.` : "Your bag is waiting."}</h2></div><div className="cart-summary">{cart.length ? <>{cart.map((p, i) => <p key={`${p.id}-${i}`}><span>{p.name}</span><b>{money.format(p.price)}</b></p>)}<div className="total"><span>Total</span><strong>{money.format(total)}</strong></div><Link className="button dark" href={`/checkout?total=${total}`}>Checkout <span>→</span></Link></> : <p>Browse the collection and add something you’ll love.</p>}</div></section>
    {chatOpen && <aside className="chat"><div className="chat-head"><div><b>Cartwise assistant</b><small>Product help, anytime</small></div><button onClick={() => setChatOpen(false)}>×</button></div><div className="messages">{messages.map((m,i) => <p key={i} className={m.role}>{m.content}</p>)}</div><form onSubmit={send}><input value={message} onChange={e => setMessage(e.target.value)} placeholder="Ask about a product…"/><button aria-label="Send">↑</button></form></aside>}
  </main>;
}
