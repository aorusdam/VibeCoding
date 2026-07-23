# Cartwise Shopping Site

A simple full-stack shopping experience built with Next.js and MongoDB. It includes a product catalogue, cart and checkout flow, customer tutorial, and a product recommendation assistant.

## Prerequisites

- Node.js 18.18 or later
- npm
- Optional: a MongoDB database (local or Atlas)
- Optional: an OpenAI API key for model-generated assistant replies

## Run locally

From the project directory:

```bash
cd shopping-site
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

## Environment variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Then update `.env.local` as needed:

```dotenv
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority
MONGODB_DB=cartwise
OPENAI_API_KEY=
```

### MongoDB

MongoDB is optional for trying the interface. Without `MONGODB_URI`, Cartwise serves the included demo product catalogue and still confirms test orders.

With MongoDB configured:

- Products are read from the `products` collection when it contains records.
- Submitted orders are written to the `orders` collection.
- Product records should match the fields in `lib/products.js`, including `id`, `name`, `category`, `price`, `description`, `image`, and `accent`.

### AI product assistant

Set `OPENAI_API_KEY` to let `/api/chat` use OpenAI for product answers and recommendations. Without a key, the assistant remains available and uses a catalog-aware built-in recommendation flow.

## Available commands

```bash
npm run dev     # Start the development server
npm run build   # Create a production build
npm run start   # Run the production server after building
```

## Application routes

| Route | Purpose |
| --- | --- |
| `/` | Product catalogue, cart, and shopping assistant |
| `/checkout` | Checkout form and order confirmation |
| `/tutorial` | Shopper guide |
| `/api/products` | Product catalogue API |
| `/api/checkout` | Order submission API |
| `/api/chat` | Product recommendation assistant API |

## Notes

- Checkout is a demo order flow; it does not process card payments. Connect a payment provider such as Stripe before using it for real orders.
- Product photography currently loads from Unsplash URLs. Replace each `image` field in `lib/products.js` with your own hosted or local product images for a production catalogue.
