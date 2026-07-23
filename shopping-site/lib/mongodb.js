import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
let clientPromise;

export async function getDb() {
  if (!uri) return null;
  if (!clientPromise) {
    const client = new MongoClient(uri);
    clientPromise = client.connect();
  }
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB || "cartwise");
}
