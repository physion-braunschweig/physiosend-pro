// Netlify Function: prüft das eingegebene Passwort gegen die geheime
// Umgebungsvariable APP_PASSWORD. Das Passwort selbst steht NIE im
// Frontend-Code, nur diese Funktion kennt es.

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { password } = JSON.parse(event.body || "{}");
    const correctPassword = process.env.APP_PASSWORD;

    if (!correctPassword) {
      return { statusCode: 500, body: JSON.stringify({ error: "APP_PASSWORD ist nicht gesetzt" }) };
    }

    const ok = typeof password === "string" && password === correctPassword;

    return {
      statusCode: 200,
      body: JSON.stringify({ ok }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
