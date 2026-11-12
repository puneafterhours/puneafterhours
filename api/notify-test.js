// Diagnostic endpoint for the Telegram admin notifier.
// Visit /api/notify-test to confirm, in one request, whether notifications are wired up:
//   - configured: are TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID both set?
//   - sendSucceeded: did a test message actually reach the Telegram chat?
//   - error: Telegram's reason when it fails (e.g. "chat not found"), for debugging.
//
// It never returns the token or chat id, so it is safe to hit from a browser. It sends a
// clearly-labelled test message to the admin chat (no personal data). Not indexed.
import { notifyDetailed } from './_notify.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  const stamp = new Date().toISOString();
  const r = await notifyDetailed(`PuneAfterhours notify-test - if you can read this, admin alerts work. (${stamp})`);
  return res.status(200).json({
    configured: r.configured,          // true only if BOTH env vars are present
    sendSucceeded: r.ok,               // true only if Telegram accepted the message
    error: r.ok ? null : r.error,      // reason on failure; never leaks secrets
    checkedAt: stamp,
    hint: !r.configured
      ? 'Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID on the deployment, then redeploy.'
      : (r.ok ? 'Working. A test message was sent to the admin chat.'
              : 'Configured but the send failed - see "error". Common causes: wrong chat id, the bot was never started/added to the chat, or a revoked token.'),
  });
}
