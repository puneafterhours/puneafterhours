// Fail-safe admin notifier (Telegram). Sends a short message to the PuneAfters admin
// whenever something lands in the review queue (a birthday or a proposal).
//
// Free: a Telegram bot has no cost and no practical rate limit for this use.
// Setup: create a bot with @BotFather to get TELEGRAM_BOT_TOKEN, then message the bot
// once and read the chat id from https://api.telegram.org/bot<token>/getUpdates - set it
// as TELEGRAM_CHAT_ID. Both live in env vars, never in code.
//
// Design rules:
// - Best effort only. If the env vars are missing or Telegram errors/times out, this
//   resolves without throwing, so a signup or proposal never fails because of a
//   notification. Callers do NOT await it as a blocker.
// - The message carries no private fields (no WhatsApp number, no hidden Instagram).
//   It is a "go review this" nudge, not a data dump.

export async function notify(text) {
  return (await notifyDetailed(text)).ok;
}

// Same send, but returns a diagnostic object instead of a bare boolean:
//   { configured, ok, status, error }
// Used by /api/notify-test so a failure can be understood (missing config vs. a real
// Telegram error like "chat not found" or "bot was blocked"). Never throws; never
// returns the token or chat id.
export async function notifyDetailed(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const configured = Boolean(token && chatId);
  if (!configured || !text) {
    return { configured, ok: false, status: 0, error: configured ? 'no message' : 'missing TELEGRAM_BOT_TOKEN and/or TELEGRAM_CHAT_ID' };
  }
  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: String(text).slice(0, 3500), // Telegram caps at 4096; stay well under
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(4000),
    });
    if (r.ok) return { configured, ok: true, status: r.status, error: null };
    // Telegram returns a JSON body with a human-readable description on failure.
    let desc = `telegram http ${r.status}`;
    try { const j = await r.json(); if (j && j.description) desc = j.description; } catch { /* keep default */ }
    return { configured, ok: false, status: r.status, error: desc };
  } catch (e) {
    return { configured, ok: false, status: 0, error: e && e.name === 'TimeoutError' ? 'timeout reaching Telegram' : 'network error reaching Telegram' };
  }
}
