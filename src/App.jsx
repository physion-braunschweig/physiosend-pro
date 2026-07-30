import { useState, useEffect, useRef, useMemo } from "react";
import {
  Play,
  Pause,
  X,
  Check,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  PlayCircle,
  RotateCcw,
  PersonStanding,
  RotateCw,
  Activity,
  Waves,
  Wind,
  Footprints,
  ChevronUp,
  ChevronDown,
  Mail,
  Copy,
  Link2,
} from "lucide-react";

const PRACTICE_NAME = "Physion Braunschweig";
const PATIENT_NAME = "Max Mustermann";
const PLACE_AND_DATE = "Braunschweig, den 22.07.2026";

const CATEGORIES = [
  { key: "HWS", label: "HWS", full: "Halswirbelsäule", color: "#2D5C56", Icon: PersonStanding },
  { key: "BWS", label: "BWS", full: "Brustwirbelsäule", color: "#6B9080", Icon: Wind },
  { key: "LWS", label: "LWS", full: "Lendenwirbelsäule", color: "#E8A33D", Icon: Waves },
  { key: "Schulter", label: "Schulter", full: "Schulter", color: "#2D5C56", Icon: RotateCw },
  { key: "Hüfte", label: "Hüfte", full: "Hüfte", color: "#6B9080", Icon: Activity },
  { key: "Knie", label: "Knie", full: "Knie", color: "#E8A33D", Icon: RotateCcw },
  { key: "Fuß", label: "Fuß", full: "Fuß", color: "#2D5C56", Icon: Footprints },
];

function catInfo(key) {
  return CATEGORIES.find((c) => c.key === key);
}

const EXERCISE_POOL = [
  { id: "hws-1", category: "HWS", name: "Nacken-Seitneigung", instruction: "Ohr langsam Richtung Schulter führen, bis eine sanfte Dehnung spürbar ist. Seite wechseln.", seconds: 30, why: "Löst Verspannungen der seitlichen Nackenmuskulatur und verbessert die Beweglichkeit der Halswirbelsäule. Regelmäßig ausgeführt wirkt sie außerdem vorbeugend gegen einseitige Fehlhaltungen im Alltag." },
  { id: "hws-2", category: "HWS", name: "Kinn-Einziehen (Chin Tuck)", instruction: "Kinn gerade nach hinten schieben, als würdest du ein Doppelkinn machen. Kurz halten, lösen.", seconds: 25, why: "Kräftigt die tiefe Nackenmuskulatur, verbessert die Kopfhaltung und entlastet die Halswirbelsäule. Besonders bei viel Bildschirmarbeit hilft sie, die typische Vorhalte des Kopfes auszugleichen." },
  { id: "bws-1", category: "BWS", name: "Brustwirbelsäulen-Rotation im Sitzen", instruction: "Aufrecht sitzen, Arme vor der Brust verschränkt, Oberkörper langsam zur Seite drehen.", seconds: 30, why: "Mobilisiert die Rotation der Brustwirbelsäule, die im Alltag durch Sitzen oft steif wird. Eine bewegliche BWS entlastet gleichzeitig Schultern und untere Wirbelsäule bei Drehbewegungen." },
  { id: "bws-2", category: "BWS", name: "Katze-Kuh", instruction: "Im Vierfüßlerstand Rücken abwechselnd runden und in ein Hohlkreuz bringen.", seconds: 35, why: "Fördert die segmentale Beweglichkeit der gesamten Wirbelsäule und lockert die Rückenmuskulatur. Der fließende Wechsel zwischen Rundung und Streckung verbessert zudem die Körperwahrnehmung." },
  { id: "lws-1", category: "LWS", name: "Beckenkippung in Rückenlage", instruction: "Knie aufgestellt, unteren Rücken sanft in den Boden drücken und wieder lösen.", seconds: 30, why: "Schult die Wahrnehmung der Lendenwirbelsäule und aktiviert die tiefe Bauchmuskulatur. Diese Grundübung ist die Basis für viele weiterführende Stabilisationsübungen im unteren Rücken." },
  { id: "lws-2", category: "LWS", name: "Rumpfrotation im Liegen", instruction: "Knie aufgestellt, langsam zu einer Seite absinken lassen, Schultern bleiben am Boden.", seconds: 30, why: "Mobilisiert die Lendenwirbelsäule sanft in der Rotation, ohne sie zu überlasten. So bleibt die Beweglichkeit erhalten, während die Bandscheiben nur schonend belastet werden." },
  { id: "lws-3", category: "LWS", name: "Rumpfstabilisation im Vierfüßlerstand", instruction: "Gegengleich Arm und Bein anheben, Rücken bleibt gerade. Position kurz halten, dann Seite wechseln.", seconds: 40, why: "Trainiert die Stabilität der Wirbelsäule unter Belastung von Armen und Beinen. Das verbessert die Koordination zwischen Rumpf und Extremitäten und schützt den Rücken im Alltag." },
  { id: "lws-4", category: "LWS", name: "Atmung & Zwerchfell (ZOA-Restoration)", instruction: "90/90 Rückenlage. Vollständig ausatmen, Rippen sinken lateral & posterior ab — kein Rippenflare.", seconds: 240, why: "Löst Verspannungen im Zwerchfell und verbessert die Grundspannung des Rumpfes. Eine funktionierende Atmung ist die Voraussetzung dafür, dass tiefer liegende Muskeln den Rücken effektiv stützen können." },
  { id: "lws-5", category: "LWS", name: "Cat-Camel (BWS-Fokus)", instruction: "Bewegung bewusst aus der Brustwirbelsäule holen, nicht aus der LWS.", seconds: 180, why: "Mobilisiert gezielt die Brustwirbelsäule, damit die Lendenwirbelsäule entlastet wird. Steifheit in der BWS führt sonst häufig zu ausgleichender Überbeweglichkeit im unteren Rücken." },
  { id: "lws-6", category: "LWS", name: "Sitzende BWS-Rotation", instruction: "Becken bleibt fixiert, Drehung kommt aus dem Brustkorb.", seconds: 120, why: "Verbessert die Rotationsfähigkeit der BWS, damit die LWS weniger kompensieren muss. Das ist besonders bei Alltagsbewegungen wie Autofahren oder Sitzen am Schreibtisch relevant." },
  { id: "lws-7", category: "LWS", name: "Hüftbeuger-Dehnung (Kniender Ausfallschritt)", instruction: "Becken leicht unterkippen, Dehnung vorne in der Hüfte spüren — nicht im unteren Rücken.", seconds: 180, why: "Dehnt den Hüftbeuger, dessen Verkürzung häufig zu Beschwerden im unteren Rücken führt. Durch langes Sitzen verkürzt dieser Muskel besonders schnell und zieht das Becken in eine ungünstige Stellung." },
  { id: "lws-8", category: "LWS", name: "Dead Bug (TVA + Atem-Integration)", instruction: "Ausatmung genau in der Bewegungsspitze. LWS bleibt neutral, kein Hohlkreuz.", seconds: 180, why: "Kräftigt die tiefe Bauchmuskulatur bei gleichzeitig neutraler, geschützter Lendenwirbelsäule. Diese Übung überträgt sich direkt auf Alltagsbewegungen, bei denen Rumpf und Gliedmaßen gegenläufig arbeiten." },
  { id: "lws-9", category: "LWS", name: "Bird-Dog (Segmentkontrolle)", instruction: "Kurze Pause in der Endposition. Becken bleibt ruhig, kein Ausweichen.", seconds: 180, why: "Verbessert die Kontrolle über einzelne Wirbelsäulensegmente unter Bewegung. Die kurze Halteposition trainiert zusätzlich die Ausdauer der tiefen Rückenmuskulatur." },
  { id: "lws-10", category: "LWS", name: "Hip Hinge im Stand (mit Stock)", instruction: "Bewegung aus der Hüfte, LWS bleibt neutral — nicht am Endpunkt zusätzlich lordosieren.", seconds: 300, why: "Trainiert ein rückenschonendes Bewegungsmuster fürs Bücken und Heben im Alltag. Der Stock dient dabei als Feedback, damit die Bewegung wirklich aus der Hüfte statt aus dem Rücken kommt." },
  { id: "lws-11", category: "LWS", name: "Pallof Press (Anti-Rotation)", instruction: "Rumpf widersteht der Zugkraft — keine Rotation in der LWS zulassen.", seconds: 240, why: "Kräftigt die Rumpfmuskulatur gegen Rotation und schützt so die Lendenwirbelsäule. Das ist besonders wichtig für Bewegungen, bei denen der Oberkörper stabil bleiben muss, während sich Arme oder Beine bewegen." },
  { id: "lws-12", category: "LWS", name: "Ausklang (Atmung zurücksetzen)", instruction: "Ruhige 360°-Atmung im Liegen. Nachspüren, kein Aktivieren mehr.", seconds: 180, why: "Beruhigt das Nervensystem und lässt die aktivierte Muskulatur wieder herunterfahren. Ein bewusster Ausklang verbessert die Regeneration nach dem Training und sollte nicht übersprungen werden." },
  { id: "schulter-1", category: "Schulter", name: "Wandengel", instruction: "Rücken flach an die Wand, Arme in W-Position anlegen. Langsam nach oben gleiten.", seconds: 30, why: "Verbessert die Beweglichkeit und Haltung der Schulterblätter, geführt an der Wand. Die Wand gibt dabei eine klare Rückmeldung, ob die Bewegung sauber und ohne Ausweichen ausgeführt wird." },
  { id: "schulter-2", category: "Schulter", name: "Schulterkreisen mit Band", instruction: "Band schulterbreit greifen, Arme gestreckt vor dem Körper. Kleine Kreise nach hinten ziehen.", seconds: 30, why: "Kräftigt die schulterumgebende Muskulatur und stabilisiert das Schultergelenk. Der Widerstand des Bands sorgt für eine kontrollierte, gleichmäßige Belastung der Rotatorenmanschette." },
  { id: "huefte-1", category: "Hüfte", name: "Hüftbeuger-Dehnung im Ausfallschritt", instruction: "Großer Ausfallschritt, Becken leicht nach vorne schieben, Oberkörper aufrecht halten.", seconds: 30, why: "Dehnt den Hüftbeuger und verbessert die Streckfähigkeit der Hüfte. Eine gute Hüftstreckung ist Voraussetzung für ein ökonomisches Gangbild und entlastet den unteren Rücken." },
  { id: "huefte-2", category: "Hüfte", name: "Muschelübung mit Band", instruction: "Seitlage, Knie gebeugt, Band über den Oberschenkeln. Oberes Knie kontrolliert nach oben öffnen.", seconds: 35, why: "Kräftigt die seitliche Gesäßmuskulatur, die das Becken beim Gehen stabilisiert. Eine Schwäche dieser Muskulatur zeigt sich häufig als Einknicken des Knies oder Absinken des Beckens." },
  { id: "knie-1", category: "Knie", name: "Wandsitz", instruction: "Rücken an der Wand, Knie im 90°-Winkel, Position ruhig halten.", seconds: 30, why: "Kräftigt die Oberschenkelmuskulatur isometrisch und entlastet dabei das Kniegelenk. Die statische Haltearbeit eignet sich besonders gut, wenn dynamische Bewegungen noch schmerzhaft sind." },
  { id: "knie-2", category: "Knie", name: "Knieextension im Sitzen", instruction: "Im Sitzen ein Bein langsam strecken, kurz halten, kontrolliert absenken.", seconds: 30, why: "Aktiviert gezielt den Quadrizeps, der das Kniegelenk stabilisiert und führt. Eine kräftige Oberschenkelmuskulatur schützt das Knie zusätzlich bei Alltagsbelastungen wie Treppensteigen." },
  { id: "fuss-1", category: "Fuß", name: "Wadendehnung am Treppenabsatz", instruction: "Ferse über die Kante absenken, bis eine Dehnung spürbar ist. Ruhig weiteratmen.", seconds: 25, why: "Dehnt die Wadenmuskulatur, die die Beweglichkeit im Sprunggelenk oft einschränkt. Eine verkürzte Wade wirkt sich negativ auf das gesamte Gangbild bis hin zu Knie und Hüfte aus." },
  { id: "fuss-2", category: "Fuß", name: "Zehenheben und -senken", instruction: "Im Stand die Zehen anheben, kurz halten, langsam wieder absenken.", seconds: 30, why: "Kräftigt die Fußmuskulatur und verbessert die Stabilität beim Stehen und Gehen. Ein starkes Fußgewölbe wirkt wie ein natürlicher Stoßdämpfer für die gesamte Beinachse." },
];

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap');
  .ps-app, .ps-app button, .ps-app input { font-family: 'Inter', sans-serif; }
  .ps-font-display { font-family: 'Fraunces', serif; }
  .ps-font-mono { font-family: 'Space Mono', monospace; }
  .ps-bg-primary { background-color: #2D5C56; }
  .ps-text-primary { color: #2D5C56; }
  .ps-border-primary { border-color: #2D5C56; }
  .ps-bg-ink { background-color: #1C2B29; }
  .ps-text-ink { color: #1C2B29; }
  .ps-bg-accent { background-color: #E8A33D; }
  .ps-text-accent { color: #E8A33D; }
  .ps-bg-alt { background-color: #E7ECE9; }
  .ps-border-alt { border-color: #E7ECE9; }
  .ps-text-muted { color: #5B6B67; }
  .ps-bg-page { background-color: #F2F4F1; }
  .ps-press { transition: transform .15s ease; }
  .ps-press:active { transform: scale(0.97); }
  .ps-shadow-cta { box-shadow: 0 8px 24px -6px rgba(232,163,61,0.55); }
  .ps-btn-accent { background-color: #E8A33D; color: #1C2B29; }
  .ps-btn-accent:disabled { background-color: #E7ECE9; color: #5B6B67; box-shadow: none; }
  .ps-pill { background: #fff; color: #1C2B29; border: 2px solid #E7ECE9; }
  .ps-pill.active { background: #2D5C56; color: #fff; border-color: #2D5C56; box-shadow: 0 0 0 4px rgba(45,92,86,0.18); }
  .ps-hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  .ps-hide-scrollbar::-webkit-scrollbar { display: none; }
`;

function useCountdown(initialSeconds, running) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const intervalRef = useRef(null);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (running && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, secondsLeft > 0]);

  return [secondsLeft, setSecondsLeft];
}

function TimerRing({ total, secondsLeft }) {
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 ? secondsLeft / total : 0;
  const offset = circumference * (1 - progress);

  return (
    <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: "rotate(-90deg)" }}>
      <circle cx="100" cy="100" r={radius} fill="none" stroke="#E7ECE9" strokeWidth="12" />
      <circle
        cx="100"
        cy="100"
        r={radius}
        fill="none"
        stroke="#E8A33D"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1s linear" }}
      />
    </svg>
  );
}

function VideoModal({ exerciseName, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{ backgroundColor: "rgba(28,43,41,0.6)", backdropFilter: "blur(4px)" }}
    >
      <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b ps-border-alt">
          <span className="ps-font-display text-lg ps-text-ink">{exerciseName}</span>
          <button onClick={onClose} aria-label="Video schließen" className="p-1.5 rounded-full ps-text-muted">
            <X size={20} />
          </button>
        </div>
        <div className="aspect-video ps-bg-ink flex flex-col items-center justify-center gap-2" style={{ color: "#F2F4F1" }}>
          <PlayCircle size={52} strokeWidth={1.3} />
          <span className="text-sm" style={{ color: "rgba(242,244,241,0.7)" }}>Demo-Video · {exerciseName}</span>
        </div>
        <div className="px-5 py-4 text-sm ps-text-muted">
          Schau dir die Ausführung in Ruhe an und kehre danach zur Übung zurück.
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("builder"); // builder | intro | exercise | done
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].key);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [index, setIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showWhy, setShowWhy] = useState(false);
  const [expandedPreviewId, setExpandedPreviewId] = useState(null);
  const [patientName, setPatientName] = useState(PATIENT_NAME);
  const [patientEmail, setPatientEmail] = useState("");
  const [targetMinutes, setTargetMinutes] = useState(20);
  const [befundNotes, setBefundNotes] = useState(
    "1. Wirbelsäule: \n2. Hüfte/Knie: \n3. Schulter: "
  );
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [durationDays, setDurationDays] = useState(30);
  const [summary, setSummary] = useState("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState(null);
  const [includeSummary, setIncludeSummary] = useState(true);
  const [isPatientView, setIsPatientView] = useState(false);
  const [planLink, setPlanLink] = useState("");
  const [emailSendStatus, setEmailSendStatus] = useState(null); // null | "sending" | "sent" | "error"
  const [secondsOverrides, setSecondsOverrides] = useState(() =>
    Object.fromEntries(EXERCISE_POOL.map((e) => [e.id, 120]))
  );

  // Beim ersten Laden prüfen, ob die URL einen codierten Plan enthält (Patienten-Link).
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      try {
        const json = decodeURIComponent(escape(atob(hash.slice(1))));
        const data = JSON.parse(json);
        if (data.selectedIds) setSelectedIds(new Set(data.selectedIds));
        if (data.secondsOverrides) setSecondsOverrides(data.secondsOverrides);
        if (data.patientName) setPatientName(data.patientName);
        if (data.startDate) setStartDate(data.startDate);
        if (data.durationDays) setDurationDays(data.durationDays);
        if (typeof data.includeSummary === "boolean") setIncludeSummary(data.includeSummary);
        if (data.summary) setSummary(data.summary);
        setIsPatientView(true);
        setScreen("intro");
      } catch (err) {
        console.error("Konnte Plan-Link nicht lesen:", err);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedExercises = useMemo(
    () =>
      EXERCISE_POOL.filter((e) => selectedIds.has(e.id)).map((e) => ({
        ...e,
        seconds: secondsOverrides[e.id],
      })),
    [selectedIds, secondsOverrides]
  );
  const filteredPool = EXERCISE_POOL.filter((e) => e.category === activeCategory);

  const exercise = selectedExercises[index];
  const [secondsLeft, setSecondsLeft] = useCountdown(exercise?.seconds ?? 0, running);

  const totalSelectedSeconds = selectedExercises.reduce((sum, e) => sum + e.seconds, 0);
  const totalMinutes = Math.round(totalSelectedSeconds / 60);
  const targetSeconds = targetMinutes * 60;
  const isTimeFull = totalSelectedSeconds >= targetSeconds;

  function toggleExercise(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function adjustSeconds(id, delta) {
    setSecondsOverrides((prev) => ({
      ...prev,
      [id]: Math.max(60, (prev[id] ?? 0) + delta),
    }));
  }

  async function generateSummary(notes) {
    if (!notes.trim()) {
      setSummary("");
      setSummaryError(null);
      return;
    }
    setIsGeneratingSummary(true);
    setSummaryError(null);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content:
                "Du bist Physiotherapeut und schreibst für einen Patienten eine kurze Zusammenfassung seines Befundes (2-3 Sätze, deutsch). Ton: sachlich-formell, professionell, wie in einem seriösen Arztbrief oder Befundschreiben. Leicht verständlich, ohne übertriebenen Fachjargon. Positiv und zuversichtlich formulieren, aber zurückhaltend — keine überschwängliche oder werbliche Sprache. Nutze ausschließlich die folgenden Stichpunkte des Therapeuten und erfinde nichts hinzu:\n\n" +
                notes +
                "\n\nAntworte NUR mit dem Fließtext der Zusammenfassung, ohne Anführungszeichen und ohne Einleitung.",
            },
          ],
        }),
      });
      const data = await response.json();
      const text = (data.content || [])
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("\n")
        .trim();
      setSummary(text || "Zusammenfassung konnte nicht erstellt werden.");
    } catch (err) {
      setSummaryError("Zusammenfassung konnte nicht erstellt werden. Bitte erneut versuchen.");
    } finally {
      setIsGeneratingSummary(false);
    }
  }

  function goToPreview() {
    setIndex(0);
    setScreen("intro");
  }

  function buildPlanLink() {
    const data = {
      selectedIds: Array.from(selectedIds),
      secondsOverrides,
      patientName,
      startDate,
      durationDays,
      includeSummary,
      summary,
    };
    const json = JSON.stringify(data);
    const encoded = btoa(unescape(encodeURIComponent(json)));
    const link = `${window.location.origin}${window.location.pathname}#${encoded}`;
    setPlanLink(link);
    return link;
  }

  async function sendPlanEmail() {
    const link = planLink || buildPlanLink();
    if (!patientEmail.trim()) {
      setEmailSendStatus("error");
      return;
    }
    setEmailSendStatus("sending");
    try {
      const res = await fetch("/.netlify/functions/send-plan-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: patientEmail,
          patientName,
          planUrl: link,
          practiceName: PRACTICE_NAME,
        }),
      });
      if (!res.ok) throw new Error("Versand fehlgeschlagen");
      setEmailSendStatus("sent");
    } catch (err) {
      setEmailSendStatus("error");
    }
  }

  function startPlan() {
    setIndex(0);
    setRunning(false);
    setScreen("exercise");
  }

  function goToNext() {
    setRunning(false);
    setShowWhy(false);
    if (index + 1 < selectedExercises.length) {
      setIndex(index + 1);
    } else {
      setScreen("done");
    }
  }

  function restart() {
    setIndex(0);
    setRunning(false);
    setShowWhy(false);
    setScreen("intro");
  }

  return (
    <div className="ps-app min-h-screen w-full ps-bg-page flex justify-center">
      <style>{GLOBAL_STYLES}</style>

      <div className="w-full max-w-md min-h-screen ps-bg-page flex flex-col relative overflow-hidden">
        <div className="pointer-events-none absolute -top-20 -right-24 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: "rgba(45,92,86,0.1)" }} />
        <div className="pointer-events-none absolute top-1/2 -left-28 w-56 h-56 rounded-full blur-3xl" style={{ backgroundColor: "rgba(232,163,61,0.1)" }} />

        {screen === "builder" && (
          <div className="flex-1 flex flex-col pt-10 pb-4">
            <div className="px-6">
              <span className="text-xs tracking-wide uppercase ps-text-muted font-medium">
                {PRACTICE_NAME}
              </span>
              <h1 className="ps-font-display font-semibold text-3xl ps-text-ink mt-3 leading-tight">
                Übungen auswählen
              </h1>
              <div className="mt-3">
                <label className="text-xs ps-text-muted mb-1 block">Patientenname</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Name eingeben"
                  className="w-full bg-white border ps-border-alt ps-text-ink rounded-xl px-3.5 py-2.5 text-sm focus:outline-none"
                />
              </div>
              <div className="mt-3">
                <label className="text-xs ps-text-muted mb-1 block">E-Mail-Adresse</label>
                <input
                  type="email"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  placeholder="name@beispiel.de"
                  className="w-full bg-white border ps-border-alt ps-text-ink rounded-xl px-3.5 py-2.5 text-sm focus:outline-none"
                />
                <p className="text-[11px] ps-text-muted mt-1">
                  Hierher geht später der Link zum Übungsplan.
                </p>
              </div>
              <p className="text-sm ps-text-muted mt-3">nach Körperregion filtern</p>

              <div className="mt-4">
                <label className="text-xs ps-text-muted mb-1.5 block">Befund für den Patienten</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIncludeSummary(false)}
                    className={`ps-pill ps-press flex-1 rounded-xl py-2.5 text-sm font-medium flex items-center justify-center gap-1.5 ${
                      !includeSummary ? "active" : ""
                    }`}
                  >
                    {!includeSummary && <Check size={14} />}
                    <span>Ohne Zusammenfassung</span>
                  </button>
                  <button
                    onClick={() => setIncludeSummary(true)}
                    className={`ps-pill ps-press flex-1 rounded-xl py-2.5 text-sm font-medium flex items-center justify-center gap-1.5 ${
                      includeSummary ? "active" : ""
                    }`}
                  >
                    {includeSummary && <Check size={14} />}
                    <span>Mit Zusammenfassung</span>
                  </button>
                </div>
              </div>

              {includeSummary && (
                <>
                  <div className="mt-4">
                    <label className="text-xs ps-text-muted mb-1 block">
                      Individueller Befund (Stichpunkte)
                    </label>
                    <textarea
                      value={befundNotes}
                      onChange={(e) => setBefundNotes(e.target.value)}
                      rows={4}
                      className="w-full bg-white border ps-border-alt ps-text-ink rounded-xl px-3.5 py-2.5 text-sm focus:outline-none resize-y leading-relaxed"
                    />
                    <p className="text-[11px] ps-text-muted mt-1">
                      Daraus erstellt Claude eine patientenfreundliche Zusammenfassung.
                    </p>
                  </div>

                  <div className="mt-4 bg-white rounded-2xl p-4 border ps-border-alt">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] uppercase tracking-wide font-medium ps-text-muted">
                        Zusammenfassung (für den Patienten)
                      </span>
                      {!isGeneratingSummary && (
                        <button
                          onClick={() => generateSummary(befundNotes)}
                          className="text-[11px] ps-text-primary underline underline-offset-2"
                        >
                          {summary ? "Neu erstellen" : "Erstellen"}
                        </button>
                      )}
                    </div>
                    {isGeneratingSummary ? (
                      <div className="space-y-2 animate-pulse">
                        <div className="h-3 ps-bg-alt rounded-full w-full" />
                        <div className="h-3 ps-bg-alt rounded-full w-11/12" />
                        <div className="h-3 ps-bg-alt rounded-full w-3/4" />
                      </div>
                    ) : summaryError ? (
                      <div>
                        <p className="text-sm ps-text-accent">{summaryError}</p>
                      </div>
                    ) : summary ? (
                      <p className="text-sm leading-relaxed" style={{ color: "rgba(28,43,41,0.9)" }}>
                        {summary}
                      </p>
                    ) : (
                      <p className="text-sm ps-text-muted italic">
                        Noch keine Zusammenfassung erstellt. Trage oben den Befund ein und klicke auf "Erstellen".
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="px-6 mt-5">
              <label className="text-xs ps-text-muted mb-1.5 block">Programmzeitraum</label>
              <div className="bg-white rounded-2xl p-4 border ps-border-alt">
                <label className="text-[11px] ps-text-muted mb-1 block">Startdatum</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-white border ps-border-alt ps-text-ink rounded-xl px-3.5 py-2.5 text-sm focus:outline-none"
                />
                <label className="text-[11px] ps-text-muted mb-1 mt-3 block">Dauer</label>
                <div className="flex gap-2">
                  {[7, 14, 30].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDurationDays(d)}
                      className={`ps-pill ps-press flex-1 rounded-xl py-2 text-sm font-medium flex items-center justify-center gap-1.5 ${
                        durationDays === d ? "active" : ""
                      }`}
                    >
                      {durationDays === d && <Check size={14} />}
                      <span>{d} Tage</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 mt-5">
              <label className="text-xs ps-text-muted mb-1.5 block">Gesamtzeit der Routine</label>
              <div className="flex gap-2">
                {[10, 20, 30].map((m) => (
                  <button
                    key={m}
                    onClick={() => setTargetMinutes(m)}
                    className={`ps-pill ps-press flex-1 rounded-xl py-2 text-sm font-medium flex items-center justify-center gap-1.5 ${
                      targetMinutes === m ? "active" : ""
                    }`}
                  >
                    {targetMinutes === m && <Check size={14} />}
                    <span>{m} Min</span>
                  </button>
                ))}
              </div>

              <div className="mt-3 bg-white rounded-2xl p-4 border ps-border-alt">
                <div className="flex items-center justify-between text-xs ps-text-muted mb-2">
                  <span>{selectedExercises.length} Übungen ausgewählt</span>
                  <span className="ps-font-mono">
                    {Math.floor(totalSelectedSeconds / 60)}:{String(totalSelectedSeconds % 60).padStart(2, "0")} / {targetMinutes}:00 Min
                  </span>
                </div>
                <div className="h-2 w-full ps-bg-alt rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (totalSelectedSeconds / targetSeconds) * 100)}%`,
                      backgroundColor: isTimeFull ? "#E8A33D" : "#2D5C56",
                    }}
                  />
                </div>
                {isTimeFull && (
                  <p className="text-xs ps-text-accent mt-2">
                    Zeit ist voll — entferne eine Übung, um eine andere hinzuzufügen.
                  </p>
                )}

                {selectedExercises.length > 0 && (
                  <div className="flex gap-1.5 overflow-x-auto mt-3 pb-0.5 ps-hide-scrollbar">
                    {selectedExercises.map((e) => (
                      <button
                        key={e.id}
                        onClick={() => toggleExercise(e.id)}
                        className="shrink-0 flex items-center gap-1 ps-bg-page rounded-full pl-3 pr-2 py-1.5 text-xs ps-text-ink"
                      >
                        {e.name}
                        <X size={12} className="ps-text-muted" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto px-6 mt-5 pb-1 ps-hide-scrollbar">
              {CATEGORIES.map((c) => {
                const active = c.key === activeCategory;
                const countInCat = EXERCISE_POOL.filter(
                  (e) => e.category === c.key && selectedIds.has(e.id)
                ).length;
                return (
                  <button
                    key={c.key}
                    onClick={() => setActiveCategory(c.key)}
                    className="shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium border"
                    style={
                      active
                        ? { backgroundColor: c.color, color: "#fff", borderColor: c.color }
                        : { backgroundColor: "#fff", color: "#1C2B29", borderColor: "#E7ECE9" }
                    }
                  >
                    <c.Icon size={15} style={active ? { color: "#fff" } : { color: c.color }} />
                    {c.label}
                    {countInCat > 0 && (
                      <span
                        className="ml-0.5 rounded-full text-[11px] w-4 h-4 flex items-center justify-center"
                        style={
                          active
                            ? { backgroundColor: "rgba(255,255,255,0.25)", color: "#fff" }
                            : { backgroundColor: `${c.color}1A`, color: c.color }
                        }
                      >
                        {countInCat}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="px-6 mt-4 flex-1 overflow-y-auto space-y-2 pb-2">
              <div className="text-xs ps-text-muted uppercase tracking-wide mb-1">
                {catInfo(activeCategory).full}
              </div>
              {filteredPool.map((e) => {
                const selected = selectedIds.has(e.id);
                const c = catInfo(e.category);
                const secs = secondsOverrides[e.id];
                const locked = isTimeFull && !selected;
                return (
                  <div
                    key={e.id}
                    className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 border bg-white"
                    style={{ borderColor: selected ? "#2D5C56" : "#E7ECE9" }}
                  >
                    <button
                      onClick={() => !locked && toggleExercise(e.id)}
                      disabled={locked}
                      className="flex items-center gap-3 flex-1 min-w-0 text-left"
                      style={locked ? { opacity: 0.4 } : {}}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${c.color}1A` }}
                      >
                        <c.Icon size={19} style={{ color: c.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium ps-text-ink truncate">
                          {e.name}
                        </div>
                      </div>
                    </button>

                    <div className="flex items-center gap-1.5 shrink-0" onClick={(ev) => ev.stopPropagation()}>
                      <button
                        onClick={() => adjustSeconds(e.id, -60)}
                        className="w-6 h-6 rounded-full ps-bg-page ps-text-ink text-sm flex items-center justify-center"
                        aria-label="Zeit verringern"
                      >
                        –
                      </button>
                      <span className="ps-font-mono text-xs ps-text-ink w-10 text-center">
                        {Math.floor(secs / 60)}:{String(secs % 60).padStart(2, "0")}
                      </span>
                      <button
                        onClick={() => adjustSeconds(e.id, 60)}
                        className="w-6 h-6 rounded-full ps-bg-page ps-text-ink text-sm flex items-center justify-center"
                        aria-label="Zeit erhöhen"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => !locked && toggleExercise(e.id)}
                      disabled={locked}
                      className="w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0"
                      style={
                        selected
                          ? { backgroundColor: "#2D5C56", borderColor: "#2D5C56" }
                          : { borderColor: "#E7ECE9", opacity: locked ? 0.4 : 1 }
                      }
                    >
                      {selected && <Check size={14} className="text-white" />}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="px-6 pt-3 border-t ps-border-alt ps-bg-page">
              <button
                onClick={goToPreview}
                disabled={selectedExercises.length === 0}
                className="ps-btn-accent ps-press ps-shadow-cta w-full rounded-full py-4 font-semibold text-[15px] flex items-center justify-center gap-2"
              >
                {selectedExercises.length > 0
                  ? `Paket erstellen (${selectedExercises.length} Übungen)`
                  : "Mindestens 1 Übung auswählen"}
                {selectedExercises.length > 0 && <ArrowRight size={18} />}
              </button>

              {selectedExercises.length > 0 && (
                <div className="mt-3 bg-white rounded-2xl p-4 border ps-border-alt">
                  <button
                    onClick={buildPlanLink}
                    className="w-full flex items-center justify-center gap-2 text-sm font-medium ps-text-primary py-1"
                  >
                    <Link2 size={16} /> Patienten-Link erzeugen
                  </button>

                  {planLink && (
                    <>
                      <div className="flex items-center gap-2 mt-3">
                        <input
                          readOnly
                          value={planLink}
                          className="flex-1 min-w-0 text-xs ps-text-muted bg-transparent border ps-border-alt rounded-lg px-2.5 py-2 truncate"
                        />
                        <button
                          onClick={() => navigator.clipboard.writeText(planLink)}
                          className="w-9 h-9 rounded-lg ps-bg-page flex items-center justify-center shrink-0"
                          aria-label="Link kopieren"
                        >
                          <Copy size={15} className="ps-text-ink" />
                        </button>
                      </div>

                      <button
                        onClick={sendPlanEmail}
                        disabled={emailSendStatus === "sending"}
                        className="ps-btn-ink ps-press w-full text-white rounded-full py-3 font-medium text-sm flex items-center justify-center gap-2 mt-3"
                      >
                        <Mail size={16} />
                        {emailSendStatus === "sending" ? "Wird gesendet…" : "Per E-Mail an Patient senden"}
                      </button>
                      {emailSendStatus === "sent" && (
                        <p className="text-xs ps-text-primary mt-2 text-center">E-Mail wurde versendet.</p>
                      )}
                      {emailSendStatus === "error" && (
                        <p className="text-xs ps-text-accent mt-2 text-center">
                          Versand fehlgeschlagen. E-Mail-Adresse geprüft?
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {screen === "intro" && (
          <div className="flex-1 flex flex-col px-6 pt-10 pb-8">
            {!isPatientView && (
              <button
                onClick={() => setScreen("builder")}
                className="flex items-center gap-1 text-xs ps-text-muted mb-3 self-start"
              >
                <ArrowLeft size={14} /> Zurück zur Auswahl
              </button>
            )}
            <span className="text-xs tracking-wide uppercase ps-text-muted font-medium">
              {PRACTICE_NAME}
            </span>
            <h1 className="ps-font-display font-semibold text-3xl ps-text-ink mt-3 leading-tight">
              Dein Übungsplan
            </h1>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm font-medium" style={{ color: "rgba(28,43,41,0.8)" }}>
                Für {patientName || "Patient/in"}
              </span>
              <span className="text-xs ps-text-muted">{PLACE_AND_DATE}</span>
            </div>

            {includeSummary && (
              <div className="mt-6 bg-white rounded-2xl p-5 border ps-border-alt">
                <span className="text-[11px] uppercase tracking-wide font-medium ps-text-muted block mb-2">
                  Zusammenfassung
                </span>
                {summary ? (
                  <p className="text-[15px] leading-relaxed" style={{ color: "rgba(28,43,41,0.9)" }}>
                    {summary}
                  </p>
                ) : (
                  <p className="text-sm ps-text-muted italic">
                    Keine Zusammenfassung hinterlegt.
                  </p>
                )}
              </div>
            )}

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl p-4 border ps-border-alt text-center">
                <div className="ps-font-display text-2xl ps-text-primary">{selectedExercises.length}</div>
                <div className="text-xs ps-text-muted mt-0.5">Übungen</div>
              </div>
              <div className="bg-white rounded-2xl p-4 border ps-border-alt text-center">
                <div className="ps-font-display text-2xl ps-text-primary">~{totalMinutes} Min</div>
                <div className="text-xs ps-text-muted mt-0.5">Gesamtzeit</div>
              </div>
              <div className="bg-white rounded-2xl p-4 border ps-border-alt text-center">
                <div className="ps-font-display text-lg ps-text-primary">
                  {startDate.split("-").reverse().join(".")}
                </div>
                <div className="text-xs ps-text-muted mt-0.5">Start</div>
              </div>
              <div className="bg-white rounded-2xl p-4 border ps-border-alt text-center">
                <div className="ps-font-display text-2xl ps-text-primary">{durationDays} Tage</div>
                <div className="text-xs ps-text-muted mt-0.5">Programmdauer</div>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              {selectedExercises.map((e) => {
                const c = catInfo(e.category);
                const isOpen = expandedPreviewId === e.id;
                return (
                  <div key={e.id} className="bg-white rounded-2xl border ps-border-alt overflow-hidden">
                    <button
                      onClick={() => setExpandedPreviewId(isOpen ? null : e.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left"
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${c.color}1A` }}>
                        <c.Icon size={19} style={{ color: c.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium ps-text-ink truncate">{e.name}</div>
                        <div className="text-xs ps-text-muted">{c.full}</div>
                      </div>
                      <span className="ps-font-mono text-xs ps-text-muted">
                        {Math.floor(e.seconds / 60)}:{String(e.seconds % 60).padStart(2, "0")}
                      </span>
                      {isOpen ? <ChevronUp size={16} className="ps-text-muted" /> : <ChevronDown size={16} className="ps-text-muted" />}
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4">
                        <p className="text-[13px] leading-relaxed mb-3" style={{ color: "rgba(28,43,41,0.85)" }}>
                          {e.instruction}
                        </p>
                        <div className="aspect-video w-full rounded-xl overflow-hidden flex flex-col items-center justify-center gap-2" style={{ backgroundColor: "#1C2B29", color: "#F2F4F1" }}>
                          <PlayCircle size={40} strokeWidth={1.3} />
                          <span className="text-xs" style={{ color: "rgba(242,244,241,0.7)" }}>Demo-Video · {e.name}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={startPlan}
              className="ps-btn-accent ps-press ps-shadow-cta mt-5 w-full rounded-full py-4 font-semibold text-[15px] flex items-center justify-center gap-2"
            >
              <Play size={18} fill="#1C2B29" /> Routine starten
            </button>
          </div>
        )}

        {screen === "exercise" && exercise && (
          <div className="flex-1 flex flex-col px-6 pt-8 pb-8">
            <div className="flex items-center justify-between text-xs ps-text-muted mb-2">
              <span>Übung {index + 1} von {selectedExercises.length}</span>
              <div className="flex items-center gap-3">
                <button onClick={goToNext} className="underline-offset-2 hover:underline" style={{ color: "rgba(91,107,103,0.7)" }}>
                  Überspringen
                </button>
                <button onClick={restart} className="underline-offset-2 hover:underline" style={{ color: "rgba(91,107,103,0.7)" }}>
                  Von vorn
                </button>
              </div>
            </div>
            <div className="h-1.5 w-full ps-bg-alt rounded-full overflow-hidden">
              <div className="h-full ps-bg-primary transition-all duration-500" style={{ width: `${(index / selectedExercises.length) * 100}%` }} />
            </div>

            <div className="flex items-center gap-3 mt-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${catInfo(exercise.category).color}1A` }}>
                {(() => {
                  const CIcon = catInfo(exercise.category).Icon;
                  return <CIcon size={22} style={{ color: catInfo(exercise.category).color }} />;
                })()}
              </div>
              <div>
                <span
                  className="text-[11px] font-medium uppercase tracking-wide px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${catInfo(exercise.category).color}1A`, color: catInfo(exercise.category).color }}
                >
                  {catInfo(exercise.category).full}
                </span>
                <h2 className="ps-font-display font-semibold text-2xl ps-text-ink leading-tight">
                  {exercise.name}
                </h2>
              </div>
            </div>
            <p className="text-[15px] leading-relaxed mt-3" style={{ color: "rgba(28,43,41,0.8)" }}>
              {exercise.instruction}
            </p>

            <button
              onClick={() => setShowWhy((v) => !v)}
              className="mt-3 self-start flex items-center gap-1.5 text-xs font-medium ps-text-primary"
            >
              {showWhy ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              Warum diese Übung?
            </button>
            {showWhy && (
              <div className="mt-2 rounded-xl px-3.5 py-3 text-[13px] leading-relaxed" style={{ backgroundColor: `${catInfo(exercise.category).color}0D`, color: "rgba(28,43,41,0.85)" }}>
                {exercise.why}
              </div>
            )}

            <div className="flex-1 flex flex-col items-center justify-center gap-6 py-4">
              <div className="relative flex items-center justify-center">
                <TimerRing total={exercise.seconds} secondsLeft={secondsLeft} />
                <div className="absolute flex flex-col items-center gap-1">
                  {(() => {
                    const CIcon = catInfo(exercise.category).Icon;
                    return <CIcon size={20} style={{ color: catInfo(exercise.category).color }} />;
                  })()}
                  <span className="ps-font-mono text-4xl ps-text-ink tabular-nums">{secondsLeft}</span>
                </div>
              </div>

              <button
                onClick={() => setRunning((r) => !r)}
                disabled={secondsLeft === 0}
                className="ps-btn-accent ps-press flex items-center gap-2 rounded-full px-6 py-3 font-medium text-[15px]"
              >
                {running ? <Pause size={18} /> : <Play size={18} />}
                {secondsLeft === 0 ? "Zeit abgelaufen" : running ? "Pause" : "Timer starten"}
              </button>

              <button
                onClick={() => setShowVideo(true)}
                className="text-sm ps-text-primary underline underline-offset-4"
              >
                Übung noch einmal ansehen
              </button>
            </div>

            <button
              onClick={goToNext}
              className="ps-press w-full rounded-full py-4 font-medium text-[15px] flex items-center justify-center gap-2 border-2"
              style={{ backgroundColor: "#fff", color: "#1C2B29", borderColor: "#1C2B29" }}
            >
              {index + 1 < selectedExercises.length ? "Weiter zur nächsten Übung" : "Plan abschließen"}
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        {screen === "done" && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-40 h-40 rounded-full" style={{ backgroundColor: "rgba(45,92,86,0.05)" }} />
              <div className="absolute w-28 h-28 rounded-full" style={{ backgroundColor: "rgba(45,92,86,0.08)" }} />
              <div className="absolute w-16 h-16 rounded-full" style={{ backgroundColor: "rgba(232,163,61,0.15)" }} />
              <CheckCircle2 size={56} className="relative ps-text-primary" strokeWidth={1.4} />
            </div>
            <h2 className="ps-font-display font-semibold text-2xl ps-text-ink mt-4">Geschafft!</h2>
            <p className="text-[15px] ps-text-muted mt-2">
              Du hast alle {selectedExercises.length} Übungen absolviert. Bis zum nächsten Termin.
            </p>

            <button onClick={restart} className="mt-6 flex items-center gap-2 ps-text-primary font-medium text-sm">
              <RotateCcw size={16} /> Plan erneut ansehen
            </button>
          </div>
        )}

        {showVideo && <VideoModal exerciseName={exercise?.name ?? ""} onClose={() => setShowVideo(false)} />}
      </div>
    </div>
  );
}
