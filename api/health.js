/**
 * Health check for the chat API. Use to verify env vars are set.
 * GET /api/health → { ok: true } or { ok: false, reason: "..." }
 */
module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const apiKey = process.env.claudeapipersonalsite;
  if (!apiKey) {
    res.status(500).json({ ok: false, reason: "API key not configured (claudeapipersonalsite)" });
    return;
  }
  res.status(200).json({ ok: true });
};
