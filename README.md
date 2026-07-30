# PhysioSend Pro – Deployment-Anleitung

Dieses Projekt ist der lauffähige Prototyp aus Claude, verpackt als echtes Vite/React-Projekt.
Aktueller Stand: **kein Backend/Datenbank** – das Übungspaket wird direkt (verschlüsselt in Base64)
in den Patienten-Link codiert. Das reicht, um heute live zu gehen. Eine echte Datenbank
(Supabase) für Verlaufsdaten kommt in einem späteren Schritt dazu.

## 1. Lokal testen (optional, aber empfohlen)

```bash
npm install
npm run dev
```

Öffnet unter `http://localhost:5173`. Damit kannst du vor dem Deployment schon mal
durchklicken.

## 2. Bei GitHub hochladen

Falls noch kein Repository vorhanden:

```bash
cd physiosend-pro
git init
git add .
git commit -m "Erste Version PhysioSend Pro"
```

Dann bei github.com ein neues, leeres Repository anlegen und die angezeigten Befehle
(`git remote add origin ...`, `git push ...`) ausführen.

## 3. Mit Netlify verbinden

1. Bei netlify.com einloggen (Account hast du schon)
2. "Add new site" → "Import an existing project" → GitHub-Repository auswählen
3. Build-Einstellungen werden aus `netlify.toml` automatisch übernommen (Build-Command
   `npm run build`, Publish-Verzeichnis `dist`) – nichts weiter einzustellen nötig
4. "Deploy" klicken. Nach 1–2 Minuten ist die Seite unter einer `*.netlify.app`-Adresse
   live.

## 4. Umgebungsvariable für den E-Mail-Versand setzen

In Netlify: Project configuration → Environment variables → "Add a variable"

| Key | Wert |
|---|---|
| `RESEND_API_KEY` | dein API-Key aus dem Resend-Dashboard (Settings → API Keys) |
| `FROM_EMAIL` | z. B. `plan@physion-braunschweig.de` |

Nach dem Setzen: "Deploys" → "Trigger deploy" → "Deploy site", damit die Function die
neue Variable bekommt.

## 5. Resend: Absenderdomain verifizieren

Falls noch nicht geschehen (in Resend unter "Domains"):

1. `physion-braunschweig.de` als Domain hinzufügen
2. Die angezeigten DNS-Einträge (SPF/DKIM) bei Strato in der DNS-Verwaltung deiner
   Domain eintragen
3. Warten, bis Resend die Domain als "Verified" anzeigt (kann bis zu 24h dauern)

Erst danach funktioniert der Versand von `plan@physion-braunschweig.de` zuverlässig.

## 6. Eigene Domain mit Netlify verbinden

In Netlify: Project configuration → Domain management → "Add a domain" →
`physion-braunschweig.de` eintragen. Netlify zeigt dir dann entweder:

- **Nameserver-Wechsel** (Netlify verwaltet die komplette DNS-Zone), oder
- **Einzelne DNS-Einträge** (A-Record/CNAME), die du bei Strato einträgst, während
  Strato weiterhin die DNS-Verwaltung behält

Für den Anfang ist Variante 2 (einzelne Einträge bei Strato) unkomplizierter, weil du
dann bei Strato auch weiterhin dein normales E-Mail-Postfach unverändert nutzen kannst.

## 7. Testlauf

1. Im Therapeuten-Bereich (Startseite) eine Test-Übung auswählen
2. Eigene E-Mail-Adresse eintragen
3. "Patienten-Link erzeugen" klicken, dann "Per E-Mail an Patient senden"
4. Prüfen, ob die Mail ankommt und der Link zur Patientenseite führt

## Bekannte Einschränkungen dieser Version

- Kein Video-Streaming von Bunny eingebunden – aktuell noch Platzhalter im Code
  (`EXERCISE_POOL` in `src/App.jsx`). Sobald deine Videos bei Bunny liegen, trage die
  jeweilige Bunny-Embed-URL pro Übung ein (siehe Kommentar im Code).
- Kein Login/Passwortschutz für den Therapeuten-Bereich – jeder mit der URL ohne
  `#...`-Anhang sieht den Builder. Für den internen Test okay, vor dem echten Einsatz
  mit Patientendaten sollte hier ein einfacher Zugriffsschutz ergänzt werden.
- Schmerzskalen und Verlaufsansicht wurden entfernt – der Befund wird stattdessen
  händisch im Freitextfeld gepflegt.
