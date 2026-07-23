import { Suspense } from "react";
import Checkout from "@/components/Checkout";

export default function CheckoutPage() {
  return <Suspense fallback={<main className="checkout"><p>Loading checkout…</p></main>}><Checkout /></Suspense>;
}
