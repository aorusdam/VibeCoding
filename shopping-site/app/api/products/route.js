import { getDb } from "@/lib/mongodb";
import { sampleProducts, serializeProduct } from "@/lib/products";

export async function GET() {
  try {
    const db = await getDb();
    if (!db) return Response.json({ products: sampleProducts, source: "demo" });
    const products = await db.collection("products").find({}).toArray();
    return Response.json({ products: products.length ? products.map(serializeProduct) : sampleProducts, source: products.length ? "mongodb" : "demo" });
  } catch {
    return Response.json({ products: sampleProducts, source: "demo" });
  }
}
