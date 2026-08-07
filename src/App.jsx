import { useState, useEffect, useRef, useMemo, useCallback } from "react";
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
  Lock,
  LogOut,
  Plus,
  Grid2x2,
  Move,
  Watch,
} from "lucide-react";

const PRACTICE_NAME = "Physion Braunschweig";
const PATIENT_NAME = "Max Mustermann";
const PLACE_AND_DATE = "Braunschweig, den 22.07.2026";

const CATEGORIES = [
  { key: "Alle", label: "Alle", full: "Alle Regionen", color: "#17233D", Icon: Grid2x2 },
  { key: "HWS", label: "HWS", full: "Halswirbelsäule", color: "#17233D", Icon: PersonStanding },
  { key: "BWS", label: "BWS", full: "Brustwirbelsäule", color: "#17233D", Icon: Wind },
  { key: "LWS", label: "LWS", full: "Lendenwirbelsäule", color: "#17233D", Icon: Waves },
  { key: "Schulter", label: "Schulter", full: "Schulter", color: "#17233D", Icon: RotateCw },
  { key: "Ellenbogen", label: "Ellenbogen", full: "Ellenbogen", color: "#17233D", Icon: Move },
  { key: "Handgelenk", label: "Handgelenk", full: "Handgelenk", color: "#17233D", Icon: Watch },
  { key: "Hüfte", label: "Hüfte", full: "Hüfte", color: "#17233D", Icon: Activity },
  { key: "Knie", label: "Knie", full: "Knie", color: "#17233D", Icon: RotateCcw },
  { key: "Fuß", label: "Fuß", full: "Fuß", color: "#17233D", Icon: Footprints },
];

const BODY_AREAS = [
  { key: "Alle", label: "Alle", Icon: Grid2x2, regions: ["HWS", "BWS", "LWS", "Schulter", "Ellenbogen", "Handgelenk", "Hüfte", "Knie", "Fuß"] },
  { key: "Wirbelsäule", label: "Wirbelsäule", Icon: Waves, regions: ["HWS", "BWS", "LWS"] },
  { key: "Obere Extremität", label: "Obere Extremität", Icon: RotateCw, regions: ["Schulter", "Ellenbogen", "Handgelenk"] },
  { key: "Untere Extremität", label: "Untere Extremität", Icon: Footprints, regions: ["Hüfte", "Knie", "Fuß"] },
];

function areaInfo(key) {
  return BODY_AREAS.find((a) => a.key === key) || BODY_AREAS[0];
}

function catInfo(key) {
  return CATEGORIES.find((c) => c.key === key) || CATEGORIES[0];
}

const EXERCISE_TYPES = [
  { key: "Dehnung & Mobilisation", Icon: Waves },
  { key: "Kräftigung & Ansteuerung", Icon: Activity },
  { key: "Atmung & Entspannung", Icon: Wind },
];
const INDICATIONS = ["Prävention", "Akutschmerz"];

const EXERCISE_POOL = [
  { id: "bws-3", category: "BWS", type: "Dehnung & Mobilisation", indications: ["Prävention"], name: "Mobilisierung BWS aus Seitlage", instruction: "Mobilisation der Brustwirbelsäule und Rippen aus der Seitlage.", seconds: 120, why: "Verbessert die Beweglichkeit von BWS und Rippengelenken – wichtig für eine freie Atmung und eine ungehinderte Rotation des Oberkörpers.", videoUrl: "https://player.mediadelivery.net/play/718490/164d658b-d053-44cd-ade8-357898ef1bb9" },
  { id: "lws-5", category: "LWS", type: "Dehnung & Mobilisation", indications: ["Prävention"], name: "Cat-Camel (BWS-Fokus)", instruction: "Katze-Kuh mit bewusstem Fokus auf die Brustwirbelsäule, nicht auf die LWS.", seconds: 180, why: "Mobilisiert gezielt die Brustwirbelsäule, damit die Lendenwirbelsäule entlastet wird. Steifheit in der BWS führt sonst häufig zu ausgleichender Überbeweglichkeit im unteren Rücken.", videoUrl: "https://player.mediadelivery.net/play/718490/d32464a3-83f4-45f1-bd1b-0f8cb3c32230" },
  { id: "schulter-1", category: "Schulter", type: "Kräftigung & Ansteuerung", indications: ["Prävention"], name: "Schulter 4 Fuß Kräftigung", instruction: "Kräftigung der hinteren Schultermuskulatur aus dem Vierfüßlerstand.", seconds: 120, why: "Stärkt die hintere Schulter- und Rotatorenmanschetten-Muskulatur, die für eine stabile Schulterführung wichtig ist.", videoUrl: "https://player.mediadelivery.net/play/718490/5e64e41b-6a1b-4cb5-b633-f12a8fe9f4b5" },
  { id: "schulter-2", category: "Schulter", type: "Dehnung & Mobilisation", indications: ["Prävention", "Akutschmerz"], name: "Kapseldehnung", instruction: "Sleeper Stretch zur Dehnung der hinteren Schulterkapsel.", seconds: 120, why: "Löst Spannungen in der hinteren Gelenkkapsel und verbessert die Innenrotation der Schulter.", videoUrl: "https://player.mediadelivery.net/play/718490/6fd15320-6e74-48e1-91a6-2d8938eeb9f5" },
];

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap');
  .ps-app, .ps-app button, .ps-app input { font-family: 'Inter', sans-serif; }
  .ps-font-display { font-family: 'Oswald', sans-serif; text-transform: uppercase; letter-spacing: 0.02em; }
  .ps-font-mono { font-family: 'Space Mono', monospace; }
  .ps-bg-primary { background-color: #17233D; }
  .ps-text-primary { color: #17233D; }
  .ps-border-primary { border-color: #17233D; }
  .ps-bg-ink { background-color: #17233D; }
  .ps-text-ink { color: #17233D; }
  .ps-bg-accent { background-color: #0E6E76; }
  .ps-text-accent { color: #0E6E76; }
  .ps-bg-alt { background-color: #E3E3E5; }
  .ps-border-alt { border-color: #E3E3E5; }
  .ps-text-muted { color: #6E6E73; }
  .ps-bg-page { background-color: #FAFAFA; }
  .ps-press { transition: transform .15s ease; }
  .ps-press:active { transform: scale(0.97); }
  .ps-shadow-cta { box-shadow: 0 8px 24px -6px rgba(23,35,61,0.35); }
  .ps-btn-accent { background-color: #0E6E76; color: #fff; }
  .ps-btn-accent:disabled { background-color: #E3E3E5; color: #6E6E73; box-shadow: none; }
  .ps-pill { background: #fff; color: #17233D; border: 2px solid #E3E3E5; }
  .ps-pill.active { background: #17233D; color: #fff; border-color: #17233D; box-shadow: 0 0 0 4px rgba(23,35,61,0.18); }
  .ps-hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  .ps-hide-scrollbar::-webkit-scrollbar { display: none; }
  @keyframes ps-flash { 0%, 100% { opacity: 1; } 50% { opacity: 0.25; } }
  .ps-flash { animation: ps-flash 0.5s ease-in-out 3; }
  @keyframes ps-confetti { 0% { transform: translate(0,0) rotate(0deg); opacity: 1; } 75% { opacity: 1; } 100% { transform: translate(var(--dx), var(--dy)) rotate(var(--rot)); opacity: 0; } }
  .ps-confetti-piece { position: absolute; bottom: 12%; left: 50%; animation-name: ps-confetti; animation-timing-function: cubic-bezier(0.2, 0.7, 0.3, 1); animation-fill-mode: forwards; }
`;

function useBeep() {
  const ctxRef = useRef(null);
  return useCallback(() => {
    try {
      if (!ctxRef.current) {
        ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = ctxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      [0, 0.18].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = 880;
        osc.type = "sine";
        gain.gain.setValueAtTime(0.0001, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + delay + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.16);
      });
    } catch (e) {}
  }, []);
}

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
      <circle cx="100" cy="100" r={radius} fill="none" stroke="#E3E3E5" strokeWidth="12" />
      <circle
        cx="100"
        cy="100"
        r={radius}
        fill="none"
        stroke="#0E6E76"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1s linear" }}
      />
    </svg>
  );
}

function VideoModal({ exerciseName, videoUrl, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(23,35,61,0.6)", backdropFilter: "blur(4px)" }}
    >
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b ps-border-alt">
          <span className="ps-font-display text-lg ps-text-ink">{exerciseName}</span>
          <button onClick={onClose} aria-label="Video schließen" className="p-1.5 rounded-full ps-text-muted">
            <X size={20} />
          </button>
        </div>
        {videoUrl ? (
          <div className="aspect-video ps-bg-ink">
            <iframe
              src={videoUrl}
              loading="lazy"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              style={{ width: "100%", height: "100%", border: "none" }}
              title={exerciseName}
            />
          </div>
        ) : (
          <div className="aspect-video ps-bg-ink flex flex-col items-center justify-center gap-2" style={{ color: "#FAFAFA" }}>
            <PlayCircle size={52} strokeWidth={1.3} />
            <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>Demo-Video · {exerciseName}</span>
          </div>
        )}
        <div className="px-5 py-4 text-sm ps-text-muted">
          Schau dir die Ausführung in Ruhe an und kehre danach zur Übung zurück.
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("builder"); // builder | intro | exercise | done
  const [activeArea, setActiveArea] = useState(null);
  const [activeCategory, setActiveCategory] = useState("Alle");
  const [activeType, setActiveType] = useState(EXERCISE_TYPES[0].key);
  const [activeIndications, setActiveIndications] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [index, setIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [wasRunningBeforeVideo, setWasRunningBeforeVideo] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState([]);
  const [showWhy, setShowWhy] = useState(false);
  const [expandedPreviewId, setExpandedPreviewId] = useState(null);
  const [patientName, setPatientName] = useState(PATIENT_NAME);
  const [patientEmail, setPatientEmail] = useState("");
  const [targetMinutes, setTargetMinutes] = useState(20);
  const [befundNotes, setBefundNotes] = useState(
    "1. Wirbelsäule: \n2. Hüfte: \n3. Schulter: \n4. Knie und Sprunggelenk: \n5. Sonstiges: "
  );
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [durationDays, setDurationDays] = useState(30);
  const [summary, setSummary] = useState("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState(null);
  const [includeSummary, setIncludeSummary] = useState(true);
  const [isPatientView, setIsPatientView] = useState(false);
  const [planLink, setPlanLink] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(
    () => typeof window !== "undefined" && localStorage.getItem("ps_unlocked") === "true"
  );
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);
  const [pwChecking, setPwChecking] = useState(false);
  const [emailSendStatus, setEmailSendStatus] = useState(null); // null | "sending" | "sent" | "error"
  const [secondsOverrides, setSecondsOverrides] = useState(() =>
    Object.fromEntries(EXERCISE_POOL.map((e) => [e.id, 60]))
  );

  useEffect(() => {
    if (screen === "done") {
      const colors = ["#0E6E76", "#17233D", "#E3E3E5", "#ffffff"];
      const pieces = Array.from({ length: 28 }).map((_, i) => {
        const angle = (Math.PI / 180) * (250 + Math.random() * 40); // ca. nach oben, leicht gestreut
        const distance = 90 + Math.random() * 160;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        return {
          id: i,
          color: colors[i % colors.length],
          dx,
          dy,
          rot: Math.round(Math.random() * 720 - 360),
          delay: Math.random() * 150,
          duration: 700 + Math.random() * 500,
          offsetX: Math.random() * 60 - 30,
          size: 5 + Math.random() * 5,
        };
      });
      setConfettiPieces(pieces);
      const t = setTimeout(() => setConfettiPieces([]), 1800);
      return () => clearTimeout(t);
    }
  }, [screen]);

  // Beim ersten Laden prüfen, ob die URL einen codierten Plan enthält (Patienten-Link).
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      try {
        const json = decodeURIComponent(escape(atob(hash.slice(1))));
        const data = JSON.parse(json);
        if (data.selectedIds) setSelectedIds(data.selectedIds);
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
      selectedIds
        .map((id) => EXERCISE_POOL.find((e) => e.id === id))
        .filter(Boolean)
        .map((e) => ({
          ...e,
          seconds: secondsOverrides[e.id],
        })),
    [selectedIds, secondsOverrides]
  );
  const filteredPool = !activeArea
    ? []
    : EXERCISE_POOL.filter(
        (e) =>
          e.type === activeType &&
          areaInfo(activeArea).regions.includes(e.category) &&
          (activeCategory === "Alle" || e.category === activeCategory) &&
          (activeIndications.length === 0 || activeIndications.some((ind) => e.indications?.includes(ind)))
      );

  const exercise = selectedExercises[index];
  const [secondsLeft, setSecondsLeft] = useCountdown(exercise?.seconds ?? 0, running);
  const beep = useBeep();

  useEffect(() => {
    if (secondsLeft === 0 && running) {
      beep();
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        try {
          navigator.vibrate([200, 100, 200]);
        } catch (e) {}
      }
    }
  }, [secondsLeft]);

  const totalSelectedSeconds = selectedExercises.reduce((sum, e) => sum + e.seconds, 0);
  const totalMinutes = Math.round(totalSelectedSeconds / 60);
  const targetSeconds = targetMinutes * 60;
  const isTimeFull = totalSelectedSeconds >= targetSeconds;

  function toggleExercise(id) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function moveSelected(id, direction) {
    setSelectedIds((prev) => {
      const index = prev.indexOf(id);
      const newIndex = index + direction;
      if (index === -1 || newIndex < 0 || newIndex >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[newIndex]] = [next[newIndex], next[index]];
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
      const response = await fetch("/.netlify/functions/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      const data = await response.json();
      if (!response.ok || !data.summary) {
        throw new Error(data.error || "Zusammenfassung fehlgeschlagen");
      }
      setSummary(data.summary);
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

  async function checkPassword() {
    setPwChecking(true);
    setPwError(false);
    try {
      const res = await fetch("/.netlify/functions/check-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwInput }),
      });
      const data = await res.json();
      if (data.ok) {
        setIsUnlocked(true);
        localStorage.setItem("ps_unlocked", "true");
      } else {
        setPwError(true);
      }
    } catch (err) {
      setPwError(true);
    } finally {
      setPwChecking(false);
    }
  }

  function buildPlanLink() {
    const data = {
      selectedIds,
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
      setScreen("sent");
    } catch (err) {
      setEmailSendStatus("error");
    }
  }

  function startNewPlan() {
    setSelectedIds([]);
    setSecondsOverrides(Object.fromEntries(EXERCISE_POOL.map((e) => [e.id, 60])));
    setPatientName(PATIENT_NAME);
    setPatientEmail("");
    setBefundNotes(
      "1. Wirbelsäule: \n2. Hüfte/Knie: \n3. Schulter: "
    );
    setSummary("");
    setSummaryError(null);
    setPlanLink("");
    setEmailSendStatus(null);
    setActiveArea(null);
    setActiveCategory("Alle");
    setActiveType(EXERCISE_TYPES[0].key);
    setActiveIndications([]);
    setScreen("builder");
  }

  function logout() {
    localStorage.removeItem("ps_unlocked");
    setIsUnlocked(false);
    startNewPlan();
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

      <div className="w-full max-w-md min-h-screen ps-bg-page flex flex-col relative overflow-hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="pointer-events-none absolute -top-20 -right-24 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: "rgba(23,35,61,0.1)" }} />
        <div className="pointer-events-none absolute top-1/2 -left-28 w-56 h-56 rounded-full blur-3xl" style={{ backgroundColor: "rgba(14,110,118,0.1)" }} />

        {screen === "builder" && !isPatientView && !isUnlocked && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: "rgba(23,35,61,0.1)" }}>
              <Lock size={24} className="ps-text-primary" />
            </div>
            <span className="text-xs tracking-wide uppercase ps-text-muted font-medium">
              {PRACTICE_NAME}
            </span>
            <h1 className="ps-font-display font-semibold text-2xl ps-text-ink mt-2">
              Therapeuten-Bereich
            </h1>
            <p className="text-sm ps-text-muted mt-1 mb-6">Bitte Passwort eingeben</p>

            <input
              type="password"
              value={pwInput}
              onChange={(e) => {
                setPwInput(e.target.value);
                setPwError(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && checkPassword()}
              placeholder="Passwort"
              autoFocus
              className="w-full max-w-xs bg-white border ps-border-alt ps-text-ink rounded-xl px-4 py-3 text-sm text-center focus:outline-none"
            />
            {pwError && (
              <p className="text-xs ps-text-accent mt-2">Falsches Passwort. Nochmal versuchen.</p>
            )}

            <button
              onClick={checkPassword}
              disabled={pwChecking || !pwInput}
              className="ps-btn-accent ps-press ps-shadow-cta mt-4 w-full max-w-xs rounded-full py-3 font-semibold text-sm"
            >
              {pwChecking ? "Prüfe…" : "Anmelden"}
            </button>
          </div>
        )}

        {screen === "builder" && (isPatientView || isUnlocked) && (
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
                      rows={6}
                      className="w-full bg-white border ps-border-alt ps-text-ink rounded-xl px-3.5 py-2.5 text-sm focus:outline-none resize-y leading-relaxed"
                    />
                    <p className="text-[11px] ps-text-muted mt-1">
                      Ohne Eintrag bei einem Punkt = ohne Befund. Kürzel: E = Einschränkung Beweglichkeit, S = Schmerz, jeweils + gering / ++ mäßig / +++ massiv (z. B. "E++, S+").
                    </p>
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
                          className="text-[11px] underline underline-offset-2"
                          style={summaryError ? { color: "#0E6E76" } : {}}
                        >
                          {summaryError ? "Fehler, klick hier" : summary ? "Neu erstellen" : "Erstellen"}
                        </button>
                      )}
                    </div>
                    {isGeneratingSummary ? (
                      <div className="space-y-2 animate-pulse">
                        <div className="h-3 ps-bg-alt rounded-full w-full" />
                        <div className="h-3 ps-bg-alt rounded-full w-11/12" />
                        <div className="h-3 ps-bg-alt rounded-full w-3/4" />
                      </div>
                    ) : summary ? (
                      <p className="text-sm leading-relaxed" style={{ color: "rgba(23,35,61,0.9)" }}>
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
                      backgroundColor: isTimeFull ? "#0E6E76" : "#17233D",
                    }}
                  />
                </div>
                {isTimeFull && (
                  <p className="text-xs ps-text-accent mt-2">
                    Zeit ist voll — entferne eine Übung, um eine andere hinzuzufügen.
                  </p>
                )}

                {selectedExercises.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    {selectedExercises.map((e, i) => (
                      <div
                        key={e.id}
                        className="flex items-center gap-2 ps-bg-page rounded-xl pl-3 pr-1.5 py-1.5"
                      >
                        <span className="ps-font-mono text-[11px] ps-text-muted w-4 text-center shrink-0">
                          {i + 1}
                        </span>
                        <span className="flex-1 min-w-0 text-xs ps-text-ink truncate">{e.name}</span>
                        <button
                          onClick={() => moveSelected(e.id, -1)}
                          disabled={i === 0}
                          aria-label="Nach oben verschieben"
                          className="p-1 rounded-full disabled:opacity-30"
                        >
                          <ChevronUp size={14} className="ps-text-muted" />
                        </button>
                        <button
                          onClick={() => moveSelected(e.id, 1)}
                          disabled={i === selectedExercises.length - 1}
                          aria-label="Nach unten verschieben"
                          className="p-1 rounded-full disabled:opacity-30"
                        >
                          <ChevronDown size={14} className="ps-text-muted" />
                        </button>
                        <button
                          onClick={() => toggleExercise(e.id)}
                          aria-label="Entfernen"
                          className="p-1 rounded-full"
                        >
                          <X size={14} className="ps-text-muted" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto px-6 mt-5 pb-1 ps-hide-scrollbar">
              {EXERCISE_TYPES.map((t) => {
                const active = t.key === activeType;
                const countInType = EXERCISE_POOL.filter(
                  (e) => e.type === t.key && selectedIds.includes(e.id)
                ).length;
                return (
                  <button
                    key={t.key}
                    onClick={() => {
                      setActiveType(t.key);
                      setActiveArea(null);
                      setActiveCategory("Alle");
                    }}
                    className="shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium border"
                    style={
                      active
                        ? { backgroundColor: "#17233D", color: "#fff", borderColor: "#17233D" }
                        : { backgroundColor: "#fff", color: "#17233D", borderColor: "#E3E3E5" }
                    }
                  >
                    <t.Icon size={15} style={active ? { color: "#fff" } : { color: "#17233D" }} />
                    {t.key}
                    {countInType > 0 && (
                      <span
                        className="ml-0.5 rounded-full text-[11px] w-4 h-4 flex items-center justify-center"
                        style={
                          active
                            ? { backgroundColor: "rgba(255,255,255,0.25)", color: "#fff" }
                            : { backgroundColor: "#17233D1A", color: "#17233D" }
                        }
                      >
                        {countInType}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="px-6 mt-3">
              <div className="flex gap-1.5 overflow-x-auto pb-1 ps-hide-scrollbar">
                {BODY_AREAS.filter((a) => a.key !== "Alle").map((a) => {
                  const active = a.key === activeArea;
                  return (
                    <button
                      key={a.key}
                      onClick={() => {
                        setActiveArea(a.key);
                        setActiveCategory("Alle");
                      }}
                      className="shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border"
                      style={
                        active
                          ? { backgroundColor: "#17233D", color: "#fff", borderColor: "#17233D" }
                          : { backgroundColor: "#fff", color: "#17233D", borderColor: "#E3E3E5" }
                      }
                    >
                      <a.Icon size={13} style={active ? { color: "#fff" } : { color: "#6E6E73" }} />
                      {a.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {activeArea && areaInfo(activeArea).regions.length > 1 && (
              <div className="px-6 mt-2">
                <div className="flex gap-1.5 overflow-x-auto pb-1 ps-hide-scrollbar">
                  {["Alle", ...areaInfo(activeArea).regions].map((key) => {
                    const c = catInfo(key);
                    const active = key === activeCategory;
                    return (
                      <button
                        key={key}
                        onClick={() => setActiveCategory(key)}
                        className="shrink-0 flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-medium border"
                        style={
                          active
                            ? { backgroundColor: "#0E6E76", color: "#fff", borderColor: "#0E6E76" }
                            : { backgroundColor: "#fff", color: "#17233D", borderColor: "#E3E3E5" }
                        }
                      >
                        <c.Icon size={13} style={active ? { color: "#fff" } : { color: "#6E6E73" }} />
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="px-6 mt-3">
              <div className="flex gap-1.5">
                {INDICATIONS.map((ind) => {
                  const active = activeIndications.includes(ind);
                  return (
                    <button
                      key={ind}
                      onClick={() =>
                        setActiveIndications((prev) =>
                          prev.includes(ind) ? prev.filter((x) => x !== ind) : [...prev, ind]
                        )
                      }
                      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border"
                      style={
                        active
                          ? { backgroundColor: "#17233D0D", color: "#17233D", borderColor: "#17233D" }
                          : { backgroundColor: "#fff", color: "#6E6E73", borderColor: "#E3E3E5" }
                      }
                    >
                      {active && <Check size={12} />}
                      {ind}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="px-6 mt-4 flex-1 overflow-y-auto space-y-2 pb-2">
              {!activeArea ? (
                <p className="text-sm ps-text-muted italic mt-2">
                  Bitte zuerst einen Körperbereich wählen.
                </p>
              ) : (
                <div className="text-xs ps-text-muted uppercase tracking-wide mb-1">
                  {activeType} · {areaInfo(activeArea).label} · {catInfo(activeCategory).full}
                </div>
              )}

              {filteredPool.map((e) => {
                const selected = selectedIds.includes(e.id);
                const c = catInfo(e.category);
                const secs = secondsOverrides[e.id];
                const locked = isTimeFull && !selected;
                return (
                  <div
                    key={e.id}
                    className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 border bg-white"
                    style={{ borderColor: selected ? "#17233D" : "#E3E3E5" }}
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
                          ? { backgroundColor: "#17233D", borderColor: "#17233D" }
                          : { borderColor: "#E3E3E5", opacity: locked ? 0.4 : 1 }
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
                        className="ps-press w-full rounded-full py-3 font-medium text-sm flex items-center justify-center gap-2 mt-3"
                        style={{ backgroundColor: "#17233D", color: "#fff" }}
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
              <span className="text-sm font-medium" style={{ color: "rgba(23,35,61,0.8)" }}>
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
                  <p className="text-[15px] leading-relaxed" style={{ color: "rgba(23,35,61,0.9)" }}>
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
                        <p className="text-[13px] leading-relaxed mb-3" style={{ color: "rgba(23,35,61,0.85)" }}>
                          {e.instruction}
                        </p>
                        {e.videoUrl ? (
                          <div className="aspect-video w-full rounded-xl overflow-hidden" style={{ backgroundColor: "#17233D" }}>
                            <iframe
                              src={e.videoUrl}
                              loading="lazy"
                              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                              allowFullScreen
                              style={{ width: "100%", height: "100%", border: "none" }}
                              title={e.name}
                            />
                          </div>
                        ) : (
                          <div className="aspect-video w-full rounded-xl overflow-hidden flex flex-col items-center justify-center gap-2" style={{ backgroundColor: "#17233D", color: "#FAFAFA" }}>
                            <PlayCircle size={40} strokeWidth={1.3} />
                            <span className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>Demo-Video · {e.name}</span>
                          </div>
                        )}
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
              <Play size={18} fill="#17233D" /> Routine starten
            </button>
          </div>
        )}

        {screen === "exercise" && exercise && (
          <div className="flex-1 flex flex-col px-6 pt-8 pb-10">
            <div className="flex items-center justify-between text-xs ps-text-muted mb-2">
              <span>Übung {index + 1} von {selectedExercises.length}</span>
              <div className="flex items-center gap-3">
                <button onClick={goToNext} className="underline-offset-2 hover:underline" style={{ color: "rgba(110,110,115,0.7)" }}>
                  Überspringen
                </button>
                <button onClick={restart} className="underline-offset-2 hover:underline" style={{ color: "rgba(110,110,115,0.7)" }}>
                  Von vorn
                </button>
              </div>
            </div>
            <div className="h-1.5 w-full ps-bg-alt rounded-full overflow-hidden">
              <div className="h-full ps-bg-primary transition-all duration-500" style={{ width: `${(index / selectedExercises.length) * 100}%` }} />
            </div>

            <div style={{ minHeight: 190 }}>
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
              <p className="text-[15px] leading-relaxed mt-3" style={{ color: "rgba(23,35,61,0.8)" }}>
                {exercise.instruction}
              </p>

              <button
                onClick={() => setShowWhy((v) => !v)}
                className="mt-3 self-start flex items-center gap-1.5 text-xs font-medium ps-text-primary"
              >
                {showWhy ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                Warum diese Übung?
              </button>
            </div>
            {showWhy && (
              <div className="mt-2 rounded-xl px-3.5 py-3 text-[13px] leading-relaxed" style={{ backgroundColor: `${catInfo(exercise.category).color}0D`, color: "rgba(23,35,61,0.85)" }}>
                {exercise.why}
              </div>
            )}

            <div className="flex-1 flex flex-col items-center justify-center gap-6 py-4">
              <div className={`relative flex items-center justify-center ${secondsLeft === 0 ? "ps-flash" : ""}`}>
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
                onClick={() => {
                  setWasRunningBeforeVideo(running);
                  setRunning(false);
                  setShowVideo(true);
                }}
                className="text-sm ps-text-primary underline underline-offset-4"
              >
                Übung noch einmal ansehen
              </button>
            </div>

            <button
              onClick={goToNext}
              className="ps-press w-full rounded-full py-4 font-medium text-[15px] flex items-center justify-center gap-2 border-2"
              style={{ backgroundColor: "#fff", color: "#17233D", borderColor: "#17233D" }}
            >
              {index + 1 < selectedExercises.length ? "Weiter zur nächsten Übung" : "Plan abschließen"}
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        {screen === "sent" && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-40 h-40 rounded-full" style={{ backgroundColor: "rgba(23,35,61,0.05)" }} />
              <div className="absolute w-28 h-28 rounded-full" style={{ backgroundColor: "rgba(23,35,61,0.08)" }} />
              <CheckCircle2 size={56} className="relative ps-text-primary" strokeWidth={1.4} />
            </div>
            <h2 className="ps-font-display font-semibold text-2xl ps-text-ink mt-4">Alles verschickt!</h2>
            <p className="text-[15px] ps-text-muted mt-2 max-w-xs">
              Der Übungsplan wurde an {patientName || "den Patienten"} gesendet.
            </p>

            <button
              onClick={startNewPlan}
              className="ps-btn-accent ps-press ps-shadow-cta mt-8 w-full max-w-xs rounded-full py-3.5 font-semibold text-sm flex items-center justify-center gap-2"
            >
              <Plus size={18} /> Neuen Trainingsplan erstellen
            </button>

            <button
              onClick={logout}
              className="mt-4 flex items-center gap-2 ps-text-muted font-medium text-sm"
            >
              <LogOut size={16} /> Ausloggen
            </button>
          </div>
        )}

        {screen === "done" && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
            {confettiPieces.map((p) => (
              <span
                key={p.id}
                className="ps-confetti-piece"
                style={{
                  width: p.size,
                  height: p.size * 1.8,
                  backgroundColor: p.color,
                  marginLeft: p.offsetX,
                  animationDuration: `${p.duration}ms`,
                  animationDelay: `${p.delay}ms`,
                  "--dx": `${p.dx}px`,
                  "--dy": `${p.dy}px`,
                  "--rot": `${p.rot}deg`,
                }}
              />
            ))}
            <div className="relative flex items-center justify-center">
              <div className="absolute w-40 h-40 rounded-full" style={{ backgroundColor: "rgba(23,35,61,0.05)" }} />
              <div className="absolute w-28 h-28 rounded-full" style={{ backgroundColor: "rgba(23,35,61,0.08)" }} />
              <div className="absolute w-16 h-16 rounded-full" style={{ backgroundColor: "rgba(14,110,118,0.15)" }} />
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

        {showVideo && (
          <VideoModal
            exerciseName={exercise?.name ?? ""}
            videoUrl={exercise?.videoUrl}
            onClose={() => {
              setShowVideo(false);
              if (wasRunningBeforeVideo) setRunning(true);
            }}
          />
        )}
      </div>
    </div>
  );
}
