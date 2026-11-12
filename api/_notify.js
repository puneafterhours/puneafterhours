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
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId || !text) return false; // not configured: silent no-op
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
    return r.ok;
  } catch {
    return false; // swallow everything: never let a notification break the request
  }
}
