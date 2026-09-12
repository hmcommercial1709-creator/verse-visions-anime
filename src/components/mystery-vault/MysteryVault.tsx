import { useCallback, useEffect, useRef, useState } from "react";
import { Sparkles, Download, Clock, Share2, Check, History } from "lucide-react";
import { drawPrize, type VaultPrize } from "./vault-prizes";

/**
 * Mystery Vault — one free key every 24 hours, redeemed for a real file.
 *
 * Honesty constraints this component holds to:
 *  - Every prize is an actual asset in this repo, handed over as a working
 *    download link. No codes, no vouchers, no promises of external value.
 *  - Prize copy quotes real dimensions / real file descriptions.
 *  - The only activity shown is the visitor's own, read back from their
 *    own browser. There is no global "live wins" feed, because there is
 *    no real global win data to display.
 *  - Sharing is optional and grants nothing, so there's no incentive to
 *    spam contacts and nothing to fake a reward for.
 *
 * The cooldown is enforced against a stored timestamp rather than a
 * counter, so a refresh doesn't reset it. It is still client-side state:
 * someone willing to clear site data or move their system clock can get
 * another key. Making that airtight needs the draw to happen server-side
 * against an authenticated identity.
 */

const COOLDOWN_MS = 24 * 60 * 60 * 1000;
const STORAGE_KEY = "gc_vault_v1";
const MAX_HISTORY = 6;

interface HistoryEntry {
  id: string;
  title: string;
  detail: string;
  download: string;
  filename: string;
  at: number;
}

interface VaultState {
  lastOpenedAt: number | null;
  history: HistoryEntry[];
}

function readState(): VaultState {
  if (typeof window === "undefined") return { lastOpenedAt: null, history: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { lastOpenedAt: null, history: [] };
    const parsed = JSON.parse(raw) as Partial<VaultState>;
    let lastOpenedAt = typeof parsed.lastOpenedAt === "number" ? parsed.lastOpenedAt : null;
    // A timestamp in the future means the clock moved backwards; treat it
    // as "just opened" rather than letting it lock the vault indefinitely.
    if (lastOpenedAt !== null && lastOpenedAt > Date.now()) lastOpenedAt = Date.now();
    return { lastOpenedAt, history: Array.isArray(parsed.history) ? parsed.history.slice(0, MAX_HISTORY) : [] };
  } catch {
    return { lastOpenedAt: null, history: [] };
  }
}

function writeState(state: VaultState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* Private mode or blocked storage — the vault still works for this session. */
  }
}

function formatCountdown(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

type Phase = "idle" | "opening" | "revealed";

export function MysteryVault() {
  const [state, setState] = useState<VaultState>({ lastOpenedAt: null, history: [] });
  const [hydrated, setHydrated] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [prize, setPrize] = useState<VaultPrize | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [copied, setCopied] = useState(false);
  const openTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    setState(readState());
    setHydrated(true);
    return () => window.clearTimeout(openTimer.current);
  }, []);

  // Drives the countdown display.
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const msUntilNextKey = state.lastOpenedAt === null ? 0 : Math.max(0, state.lastOpenedAt + COOLDOWN_MS - now);
  const hasKey = hydrated && msUntilNextKey === 0;

  const openVault = useCallback(() => {
    if (!hasKey || phase === "opening") return;
    setPhase("opening");
    const won = drawPrize(state.history[0]?.id);
    openTimer.current = window.setTimeout(() => {
      const openedAt = Date.now();
      const entry: HistoryEntry = {
        id: won.id,
        title: won.title,
        detail: won.detail,
        download: won.download,
        filename: won.filename,
        at: openedAt,
      };
      const next: VaultState = {
        lastOpenedAt: openedAt,
        history: [entry, ...state.history].slice(0, MAX_HISTORY),
      };
      setState(next);
      writeState(next);
      setPrize(won);
      setPhase("revealed");
    }, 1900);
  }, [hasKey, phase, state]);

  const referralUrl = typeof window !== "undefined"
    ? `${window.location.origin}/?ref=vault`
    : "https://gamecastle.store/?ref=vault";
  const shareText = "Free anime wallpapers and guides from GameCastle's daily vault:";

  const share = async (target: "native" | "whatsapp" | "telegram" | "copy") => {
    if (target === "native" && typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "GameCastle Vault", text: shareText, url: referralUrl });
      } catch {
        /* Visitor dismissed the sheet. */
      }
      return;
    }
    if (target === "whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${referralUrl}`)}`, "_blank", "noopener");
      return;
    }
    if (target === "telegram") {
      window.open(
        `https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=${encodeURIComponent(shareText)}`,
        "_blank",
        "noopener",
      );
      return;
    }
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard blocked. */
    }
  };

  const canShareNatively = typeof navigator !== "undefined" && typeof (navigator as Navigator).share === "function";

  return (
    <section className="mv-root relative overflow-hidden rounded-[26px] p-[1px]">
      <div className="relative rounded-[25px] bg-[#07080f] p-5 sm:p-7">
        <div className="mv-grid pointer-events-none absolute inset-0 rounded-[25px]" />
        <div className="mv-aura pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full" />
        <div className="mv-aura mv-aura-cyan pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full" />

        <div className="relative grid items-center gap-8 lg:grid-cols-[1.05fr_1fr]">
          {/* Copy side */}
          <div>
            <span className="mv-eyebrow">
              <Sparkles className="h-3.5 w-3.5" />
              Mystery Vault
            </span>
            <h2 className="mt-4 font-display text-3xl font-black leading-tight tracking-tight sm:text-4xl">
              One free key every day.
              <span className="mv-gradient-text"> Real files, every time.</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
              Every prize in this vault is an actual download — original GameCastle wallpapers
              and our anime guide resources. No codes, no vouchers, nothing you have to redeem
              somewhere else. Your key refreshes 24 hours after each opening.
            </p>

            {hydrated && state.history.length > 0 && (
              <div className="mt-6">
                <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <History className="h-3.5 w-3.5" />
                  Your vault history
                </div>
                <ul className="space-y-1.5">
                  {state.history.slice(0, 3).map((h) => (
                    <li key={`${h.id}-${h.at}`} className="mv-history-row">
                      <span className="truncate text-slate-300">{h.title}</span>
                      <a href={h.download} download={h.filename} className="mv-relink">
                        <Download className="h-3 w-3" />
                        Download
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Vault side */}
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={openVault}
              disabled={!hasKey || phase === "opening"}
              aria-label={hasKey ? "Open the vault" : "Vault locked until your next key"}
              className={`mv-door ${phase === "opening" ? "is-opening" : ""} ${hasKey ? "is-ready" : "is-locked"}`}
            >
              <span className="mv-ring mv-ring-1" />
              <span className="mv-ring mv-ring-2" />
              <span className="mv-ring mv-ring-3" />
              <span className="mv-core">
                {phase === "opening" ? "◈" : hasKey ? "◆" : "◇"}
              </span>
            </button>

            <div className="mt-5 w-full max-w-sm text-center">
              {phase === "revealed" && prize ? (
                <div className="mv-prize">
                  <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-300">Unlocked</div>
                  {prize.preview && (
                    <img
                      src={prize.preview}
                      alt={prize.title}
                      loading="lazy"
                      className="mt-3 h-28 w-full rounded-xl object-cover"
                    />
                  )}
                  <div className="mt-3 font-bold text-slate-50">{prize.title}</div>
                  <div className="mt-0.5 text-xs text-slate-400">
                    {prize.series ? `${prize.series} · ` : ""}{prize.detail}
                  </div>
                  <a href={prize.download} download={prize.filename} className="mv-btn mt-4">
                    <Download className="h-4 w-4" />
                    Download now
                  </a>
                </div>
              ) : hasKey ? (
                <>
                  <div className="mv-status">1 key available</div>
                  <button type="button" onClick={openVault} disabled={phase === "opening"} className="mv-btn mt-3 w-full">
                    {phase === "opening" ? "Opening…" : "Open the vault"}
                  </button>
                </>
              ) : (
                <>
                  <div className="mv-status flex items-center justify-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    Next key in
                  </div>
                  <div className="mv-countdown">{hydrated ? formatCountdown(msUntilNextKey) : "--:--:--"}</div>
                </>
              )}
            </div>

            {/* Optional sharing — grants nothing, gates nothing. */}
            <div className="mt-6 w-full max-w-sm">
              <div className="mb-2 text-center text-[11px] text-slate-500">
                Enjoying it? Share the vault — entirely optional.
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {canShareNatively && (
                  <button type="button" onClick={() => share("native")} className="mv-share">
                    <Share2 className="h-3.5 w-3.5" /> Share
                  </button>
                )}
                <button type="button" onClick={() => share("whatsapp")} className="mv-share">WhatsApp</button>
                <button type="button" onClick={() => share("telegram")} className="mv-share">Telegram</button>
                <button type="button" onClick={() => share("copy")} className="mv-share">
                  {copied ? <><Check className="h-3.5 w-3.5" /> Copied</> : "Copy link"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .mv-root {
          background: linear-gradient(140deg, rgba(168,85,247,0.55), rgba(56,89,140,0.12) 42%, rgba(34,211,238,0.5));
          box-shadow: 0 34px 90px -34px rgba(147,51,234,0.6), 0 0 0 1px rgba(148,163,184,0.06);
        }
        .mv-grid {
          background-image: linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px);
          background-size: 34px 34px;
          mask-image: radial-gradient(ellipse at 50% 40%, #000 30%, transparent 78%);
        }
        .mv-aura { background: radial-gradient(circle, rgba(168,85,247,0.28), transparent 65%); filter: blur(30px); }
        .mv-aura-cyan { background: radial-gradient(circle, rgba(34,211,238,0.24), transparent 65%); }
        .mv-eyebrow {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 6px 13px; border-radius: 999px; font-size: 11px; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.18em; color: #d8b4fe;
          background: rgba(168,85,247,0.12); border: 1px solid rgba(168,85,247,0.35);
        }
        .mv-gradient-text {
          background: linear-gradient(100deg, #c084fc, #f0abfc 40%, #67e8f9);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .mv-history-row {
          display: flex; align-items: center; justify-content: space-between; gap: 10px;
          padding: 7px 11px; border-radius: 10px; font-size: 12px;
          background: rgba(255,255,255,0.035); border: 1px solid rgba(148,163,184,0.12);
        }
        .mv-relink {
          display: inline-flex; align-items: center; gap: 5px; flex-shrink: 0;
          font-weight: 700; color: #67e8f9; transition: color 140ms ease;
        }
        .mv-relink:hover { color: #a5f3fc; text-decoration: underline; }
        .mv-door {
          position: relative; display: grid; place-items: center;
          width: 190px; height: 190px; border-radius: 50%;
          background: radial-gradient(circle at 34% 30%, #2a1b45, #0b0a18 68%);
          border: 1px solid rgba(168,85,247,0.4);
          box-shadow: inset 0 0 46px rgba(168,85,247,0.28), 0 20px 60px -24px rgba(168,85,247,0.8);
          transition: transform 220ms cubic-bezier(0.2,0.9,0.3,1), box-shadow 220ms ease;
        }
        .mv-door.is-ready { cursor: pointer; }
        .mv-door.is-ready:hover { transform: scale(1.035); box-shadow: inset 0 0 52px rgba(168,85,247,0.4), 0 26px 70px -24px rgba(34,211,238,0.85); }
        .mv-door.is-locked { cursor: not-allowed; filter: saturate(0.55) brightness(0.8); }
        .mv-ring {
          position: absolute; border-radius: 50%; border: 1px solid rgba(34,211,238,0.32);
        }
        .mv-ring-1 { inset: 16px; border-style: dashed; animation: mv-spin 22s linear infinite; }
        .mv-ring-2 { inset: 34px; border-color: rgba(168,85,247,0.42); animation: mv-spin 15s linear infinite reverse; }
        .mv-ring-3 { inset: 54px; border-color: rgba(240,171,252,0.3); animation: mv-spin 30s linear infinite; }
        .mv-door.is-opening .mv-ring-1 { animation-duration: 1.1s; }
        .mv-door.is-opening .mv-ring-2 { animation-duration: 0.8s; }
        .mv-door.is-opening .mv-ring-3 { animation-duration: 1.5s; }
        .mv-door.is-opening { box-shadow: inset 0 0 70px rgba(34,211,238,0.6), 0 0 90px -10px rgba(34,211,238,0.9); }
        @keyframes mv-spin { to { transform: rotate(360deg); } }
        .mv-core {
          font-size: 46px; line-height: 1; color: #67e8f9;
          text-shadow: 0 0 26px rgba(34,211,238,0.95);
        }
        .mv-door.is-locked .mv-core { color: #64748b; text-shadow: none; }
        .mv-door.is-opening .mv-core { animation: mv-pulse 0.6s ease-in-out infinite; }
        @keyframes mv-pulse { 0%,100% { transform: scale(1); opacity: 1 } 50% { transform: scale(1.22); opacity: 0.65 } }
        .mv-status { font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.16em; color: #94a3b8; }
        .mv-countdown {
          margin-top: 4px; font-family: ui-monospace, monospace; font-size: 27px; font-weight: 800;
          color: #e2e8f0; letter-spacing: 0.06em; text-shadow: 0 0 22px rgba(103,232,249,0.35);
        }
        .mv-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          padding: 12px 20px; border-radius: 13px; font-size: 13px; font-weight: 800;
          color: #0a0418; background: linear-gradient(180deg, #e9d5ff, #a855f7 55%, #7e22ce);
          box-shadow: 0 12px 30px -10px rgba(168,85,247,0.95), inset 0 1px 0 rgba(255,255,255,0.55);
          transition: transform 130ms ease, filter 130ms ease;
        }
        .mv-btn:hover { transform: translateY(-1px); filter: brightness(1.07); }
        .mv-btn:active { transform: translateY(0) scale(0.985); }
        .mv-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .mv-prize {
          padding: 16px; border-radius: 18px; text-align: center;
          background: linear-gradient(168deg, rgba(24,18,44,0.95), rgba(9,10,20,0.97));
          border: 1px solid rgba(168,85,247,0.4);
          box-shadow: 0 26px 64px -26px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.08);
          animation: mv-rise 240ms cubic-bezier(0.2,0.9,0.3,1);
        }
        @keyframes mv-rise { from { opacity: 0; transform: translateY(10px) scale(0.97) } to { opacity: 1; transform: none } }
        .mv-share {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 13px; border-radius: 999px; font-size: 11.5px; font-weight: 700; color: #cbd5e1;
          background: rgba(255,255,255,0.045); border: 1px solid rgba(148,163,184,0.18);
          transition: border-color 140ms ease, color 140ms ease, background 140ms ease;
        }
        .mv-share:hover { border-color: rgba(34,211,238,0.6); color: #a5f3fc; background: rgba(34,211,238,0.08); }
      `}</style>
    </section>
  );
}
