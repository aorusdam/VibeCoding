import { getDb } from "@/lib/mongodb";

export async function POST(request) {
  const body = await request.json();
  const { customer, items, total } = body;
  if (!customer?.name || !customer?.email || !items?.length) {
    return Response.json({ error: "Please provide your contact details and at least one item." }, { status: 400 });
  }
  const order = { customer, items, total, status: "confirmed", createdAt: new Date() };
  try {
    const db = await getDb();
    if (db) await db.collection("orders").insertOne(order);
  } catch (error) {
    console.error("Order persistence unavailable", error);
  }
  return Response.json({ orderNumber: `CW-${Date.now().toString().slice(-6)}` });
}
