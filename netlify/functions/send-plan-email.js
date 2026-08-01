// Netlify Function: sendet die Patienten-Mail über Resend.
// Der RESEND_API_KEY wird als Umgebungsvariable in den Netlify-Einstellungen hinterlegt,
// steht also NIE im Frontend-Code.

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { to, patientName, planUrl, practiceName } = JSON.parse(event.body || "{}");

    if (!to || !planUrl) {
      return { statusCode: 400, body: JSON.stringify({ error: "to und planUrl sind erforderlich" }) };
    }

    const fromAddress = process.env.FROM_EMAIL || "plan@physion-braunschweig.de";
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ error: "RESEND_API_KEY ist nicht gesetzt" }) };
    }

    const subject = `Dein Übungsplan von ${practiceName || "deiner Praxis"}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1C2B29;">
        <p>Hallo ${patientName || ""},</p>
        <p>dein individueller Übungsplan steht bereit. Klicke auf den folgenden Link, um ihn zu öffnen:</p>
        <p style="margin: 24px 0;">
          <a href="${planUrl}" style="background:#E8A33D;color:#1C2B29;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:600;display:inline-block;">
            Übungsplan öffnen
          </a>
        </p>
        <p style="font-size:13px;color:#5B6B67;">Falls der Button nicht funktioniert: <a href="${planUrl}" style="color:#2D5C56;">Übungsplan öffnen</a></p>
        <p>Viele Grüße<br/>${practiceName || "Deine Praxis"}</p>
      </div>
    `;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
from: `${practiceName || "Physion Braunschweig"} <${fromAddress}>`,        to: [to],
        subject,
        html,
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      return { statusCode: 502, body: JSON.stringify({ error: "Resend-Fehler", details: errText }) };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
