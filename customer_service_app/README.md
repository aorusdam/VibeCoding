# Lord of Mysteries Customer Service Assistant

A standalone Next.js chatbot that answers beginner-safe questions about *Lord of Mysteries* from a reviewed knowledge context. It supports OpenAI's Responses API and DeepSeek's Chat Completions API.

## Run it

```bash
cd customer_service_app
npm install
cp .env.example .env.local
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Configure an LLM provider

Set one provider in `.env.local`.

```dotenv
# OpenAI
AI_PROVIDER=openai
OPENAI_API_KEY=your_key
OPENAI_MODEL=gpt-4.1-mini
```

```dotenv
# DeepSeek
AI_PROVIDER=deepseek
DEEPSEEK_API_KEY=your_key
DEEPSEEK_MODEL=deepseek-chat
```

The chat route is `/api/lotm-chat`. Its reviewed, spoiler-conscious source context is in `lib/lotm-context.js`; expand it only with content you have reviewed and are authorized to use. The app does not scrape the source wiki at request time.
