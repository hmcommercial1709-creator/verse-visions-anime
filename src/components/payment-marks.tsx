/**
 * Lightweight, dependency-free brand marks for the checkout page.
 * Drawn as inline SVG so they stay crisp, themeable and add zero network cost.
 */

function Chip({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <span
      aria-label={label}
      title={label}
      className="inline-flex h-7 items-center justify-center rounded-md border border-border/60 bg-card/50 px-2 text-foreground/80"
    >
      {children}
    </span>
  );
}

export function VisaMark() {
  return (
    <Chip label="Visa">
      <svg viewBox="0 0 48 16" className="h-3 w-auto" fill="currentColor" role="img">
        <path d="M18.6 15.3h-3.9L17.2.7h3.9l-2.5 14.6ZM12.8.7 9.1 10.8 8.7 8.6 7.5 2.4S7.4.7 5.5.7H.1L0 1.1s2.1.4 4.5 1.9l3.6 12.3h4.1L18.5.7h-5.7ZM44.5 15.3H48L45 .7h-3c-1.4 0-1.8 1.1-1.8 1.1l-5.6 13.5h4l.8-2.2h4.9l.2 2.2Zm-4.2-5.3 2-5.6 1.2 5.6h-3.2ZM34.9 4.3l.6-3.2S33.7.4 31.8.4c-2.1 0-7 .9-7 5.4 0 4.2 5.8 4.2 5.8 6.4 0 .5-.5 1.5-2.6 1.5-2.1 0-3.6-.8-3.6-.8l-.6 3.2s1.7.7 4.2.7c2.5 0 6.7-1.3 6.7-5.3 0-4.2-5.9-4.5-5.9-6.3 0-.9 1-1.4 2.7-1.4 1.7 0 3.4.5 3.4.5Z" />
      </svg>
    </Chip>
  );
}

export function MastercardMark() {
  return (
    <Chip label="Mastercard">
      <svg viewBox="0 0 32 20" className="h-3.5 w-auto" role="img">
        <circle cx="12" cy="10" r="9" fill="currentColor" opacity="0.85" />
        <circle cx="20" cy="10" r="9" fill="currentColor" opacity="0.45" />
      </svg>
    </Chip>
  );
}

export function AmexMark() {
  return (
    <Chip label="American Express">
      <span className="text-[9px] font-bold uppercase tracking-[0.08em]">Amex</span>
    </Chip>
  );
}

export function ApplePayMark() {
  return (
    <Chip label="Apple Pay">
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" role="img">
        <path d="M16.4 12.7c0-2 1.6-3 1.7-3-.9-1.4-2.4-1.6-2.9-1.6-1.3-.1-2.5.8-3.2.8-.7 0-1.7-.7-2.8-.7-1.4 0-2.8.9-3.5 2.2-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.6 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7s1.6.7 2.8.7c1.1 0 1.9-1.1 2.6-2.1.5-.8.8-1.5 1-2.3-.1 0-2.3-.9-2.3-3.4v-.6ZM14.5 5.9c.6-.7.9-1.7.8-2.7-.9.1-2 .6-2.6 1.3-.6.7-1 1.7-.9 2.6 1 .1 2.1-.5 2.7-1.2Z" />
      </svg>
      <span className="ml-1 text-[9px] font-bold tracking-[0.06em]">Pay</span>
    </Chip>
  );
}

export function GooglePayMark() {
  return (
    <Chip label="Google Pay">
      <span className="text-[9px] font-bold uppercase tracking-[0.08em]">G Pay</span>
    </Chip>
  );
}

export function CryptoMark({ label = "Crypto" }: { label?: string }) {
  return (
    <Chip label={label}>
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" role="img">
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm2.6 7.3c0 .9-.5 1.5-1.2 1.8.9.2 1.5.9 1.5 1.9 0 1.3-1 2.1-2.6 2.2v1.3h-1.1v-1.3H9.9v1.3H8.8v-1.3H7.4v-1.2h1V9.9h-1V8.7h1.4V7.4h1.1v1.3h1.3V7.4h1.1v1.3c1.3.1 2.3.7 2.3 1.9Zm-1.4.4c0-.6-.5-.9-1.4-.9H9.9v1.9h1.9c.9 0 1.4-.3 1.4-1Zm.3 3.2c0-.7-.5-1-1.6-1H9.9v2.1h2c1.1 0 1.6-.4 1.6-1.1Z" />
      </svg>
    </Chip>
  );
}

/** Full accepted-methods strip used under the pay button. */
export function AcceptedMarks() {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <VisaMark />
      <MastercardMark />
      <AmexMark />
      <ApplePayMark />
      <GooglePayMark />
      <CryptoMark label="Bitcoin, Ethereum, USDT & more" />
    </div>
  );
}
