const Anthropic = require("@anthropic-ai/sdk");
const { getSystemPrompt } = require("./knowledge");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.claudeapipersonalsite;
  if (!apiKey) {
    res.status(500).json({ error: "API key not configured" });
    return;
  }

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    res.status(400).json({ error: "Invalid JSON body" });
    return;
  }

  const { messages } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "messages array is required" });
    return;
  }

  // Simple usage logging — visible in Vercel function logs
  console.log("[CHAT_USAGE]", new Date().toISOString(), "messages:", messages.length);

  const client = new Anthropic({ apiKey });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders?.();

  try {
    const stream = client.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: getSystemPrompt(),
      messages: messages.map((m) => ({
        role: m.role,
        content: typeof m.content === "string" ? m.content : m.content,
      })),
    });

    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta?.type === "text_delta" && event.delta.text) {
        res.write(`data: ${JSON.stringify({ type: "text", text: event.delta.text })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
  } catch (err) {
    console.error("Chat API error:", err);
    res.write(`data: ${JSON.stringify({ type: "error", error: err.message || "An error occurred" })}\n\n`);
  } finally {
    res.end();
  }
};
