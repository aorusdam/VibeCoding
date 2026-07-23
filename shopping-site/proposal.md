# Cartwise Shopping Site Proposal

## Overview

Cartwise is a calm, simple ecommerce starter built with **Next.js** and **MongoDB**. It focuses on a short, understandable path: browse a compact catalog, receive product advice, add items, and check out.

## Included experience

- Responsive product catalogue with clear price, category, description, and cart controls.
- Cart subtotal and checkout form with an instant order confirmation.
- A dedicated “How it works” tutorial page for new shoppers.
- Product-aware shopping assistant. It answers common product and recommendation questions from the catalog, and can use OpenAI Responses API when `OPENAI_API_KEY` is configured.
- Simple editorial visual system: airy spacing, limited sage/rust palette, accessible contrast, and mobile layout.

## Technical design

| Area | Choice |
| --- | --- |
| Frontend & routes | Next.js App Router + React |
| Data | MongoDB (`products`, `orders`) using the official driver |
| Store endpoints | `/api/products`, `/api/checkout`, `/api/chat` |
| AI | Optional OpenAI Responses API, with catalog-aware fallback for local development |

The app runs in demo mode without a database, rendering the included sample catalogue. Once MongoDB is configured, product retrieval and order persistence use the configured database. This lets design work continue before deployment credentials are available.

## Run locally

1. `cd shopping-site`
2. `npm install`
3. Copy `.env.example` to `.env.local` and add `MONGODB_URI` when ready.
4. `npm run dev`

Seed a `products` collection with documents matching `lib/products.js` to replace the included demo data. Add `OPENAI_API_KEY` to activate model-generated assistant replies.

## Next recommended increments

- Persist the cart per signed-in customer and add inventory validation at checkout.
- Integrate a payment processor such as Stripe; the current checkout intentionally confirms orders without charging a card.
- Add authentication, order email, and a small admin product manager before public launch.
