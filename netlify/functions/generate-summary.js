// Netlify Function: erstellt die patientenfreundliche Zusammenfassung über
// die Claude API. Läuft serverseitig, damit kein CORS-Fehler im Browser
// auftritt und der API-Key nie im Frontend-Code sichtbar ist.

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { notes } = JSON.parse(event.body || "{}");
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!notes || !notes.trim()) {
      return { statusCode: 400, body: JSON.stringify({ error: "notes ist erforderlich" }) };
    }
    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ error: "ANTHROPIC_API_KEY ist nicht gesetzt" }) };
    }

    const prompt =
      "Du bist Physiotherapeut und schreibst für einen Patienten eine kurze Zusammenfassung seines Befundes (2-3 Sätze, deutsch). Ton: sachlich-formell, professionell, wie in einem seriösen Arztbrief oder Befundschreiben. Leicht verständlich, ohne übertriebenen Fachjargon. Positiv und zuversichtlich formulieren, aber zurückhaltend — keine überschwängliche oder werbliche Sprache. Nutze ausschließlich die folgenden Stichpunkte des Therapeuten und erfinde nichts hinzu:\n\n" +
      notes +
      "\n\nAntworte NUR mit dem Fließtext der Zusammenfassung, ohne Anführungszeichen und ohne Einleitung.";

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 500,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      return { statusCode: 502, body: JSON.stringify({ error: "Claude-API-Fehler", details: errText }) };
    }

    const data = await anthropicRes.json();
    const text = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    return {
      statusCode: 200,
      body: JSON.stringify({ summary: text || "Zusammenfassung konnte nicht erstellt werden." }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
