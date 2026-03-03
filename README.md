# personal-website

Single-file React site with a custom AI chatbot powered by Claude.

## Run locally

**Static site only** (no chatbot):

```bash
python3 -m http.server 5173
```

Then open `http://localhost:5173`.

**With chatbot** (requires Vercel CLI):

```bash
npm install
vercel dev
```

Then open the URL shown (e.g. `http://localhost:3000`). The chatbot calls `/api/chat`, which runs as a Vercel serverless function.

## Environment

Set `claudeapipersonalsite` in Vercel project settings (Environment Variables) with your Anthropic API key.

## Usage logging

Each chat request logs `[CHAT_USAGE]` with a timestamp and message count. Check **Vercel → Project → Logs** (or the deployment’s Function logs) and filter for `CHAT_USAGE` to see when the chatbot is used.

## Customize

Edit `index.html` (content, links, styles, pages). Chatbot directive and knowledge: `api/knowledge.js`.

Hero image is `assets/profile.png`.

## Deploy

Deploy to Vercel. The `api/` folder is deployed as serverless functions automatically.