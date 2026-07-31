import { useEffect, useRef, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Check, ChevronDown, Globe } from "lucide-react";
import { LOCALES, isReadyLocale, localeEntryPath, useLocale, type LocaleCode } from "@/lib/i18n";

interface Props {
  /** "header" = compact pill, "footer" = wider block */
  variant?: "header" | "footer";
  align?: "start" | "end";
  className?: string;
}

export function LanguageSelector({ variant = "header", align = "end", className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const active = useLocale();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const switchTo = (code: LocaleCode) => {
    setOpen(false);
    // Preserve the current page — jump to its localized equivalent path.
    navigate({ to: localeEntryPath(pathname, code) as string, replace: false });
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language: ${active.english}. Change language`}
        className={
          variant === "header"
            ? "flex items-center gap-1.5 rounded-lg border border-border/60 bg-secondary/50 px-2.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
            : "flex w-full items-center gap-2 rounded-lg border border-border/60 bg-secondary/40 px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground sm:w-56"
        }
      >
        <Globe className="h-4 w-4 shrink-0" />
        <span>{variant === "header" ? active.short : active.label}</span>
        <ChevronDown className={`h-3 w-3 opacity-70 transition-transform ${open ? "rotate-180" : ""} ${variant === "footer" ? "ms-auto" : ""}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Select language"
          className={`absolute z-50 mt-2 max-h-80 w-52 overflow-y-auto rounded-xl border border-border/70 bg-popover p-1.5 shadow-2xl ${
            align === "end" ? "end-0" : "start-0"
          } ${variant === "footer" ? "bottom-full mb-2 mt-0" : ""}`}
        >
          {LOCALES.map((l) => {
            const isActive = l.code === active.code;
            return (
              <li key={l.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => switchTo(l.code)}
                  dir={l.dir}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                    isActive ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <span className="w-7 shrink-0 text-[10px] font-mono font-bold uppercase tracking-wider opacity-70">
                    {l.short}
                  </span>
                  <span className="truncate">{l.label}</span>
                  {isReadyLocale(l.code) && !isActive && (
                    <span className="ms-auto shrink-0 rounded-full border border-primary/40 bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
                      Live
                    </span>
                  )}
                  {isActive && <Check className="ms-auto h-3.5 w-3.5 shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
