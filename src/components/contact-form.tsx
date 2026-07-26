import { useState } from "react";
import { z } from "zod";
import { CheckCircle2, Loader2, Send } from "lucide-react";

const contactSchema = z.object({
  name: z.string().trim().min(2, { message: "Please enter your name (2+ characters)." }).max(100, { message: "Name must be under 100 characters." }),
  email: z.string().trim().email({ message: "Enter a valid email address." }).max(255, { message: "Email must be under 255 characters." }),
  topic: z.enum(["editorial", "correction", "pitch", "business", "dmca", "other"]),
  subject: z.string().trim().min(4, { message: "Subject must be at least 4 characters." }).max(140, { message: "Subject must be under 140 characters." }),
  message: z.string().trim().min(20, { message: "Please write at least 20 characters so we can help properly." }).max(4000, { message: "Message must be under 4000 characters." }),
});

type Fields = z.infer<typeof contactSchema>;
type Errors = Partial<Record<keyof Fields, string>>;

const topics: { value: Fields["topic"]; label: string; inbox: string }[] = [
  { value: "editorial", label: "Editorial question", inbox: "editors@animeverse.example" },
  { value: "correction", label: "Correction / fact check", inbox: "corrections@animeverse.example" },
  { value: "pitch", label: "Pitch an article", inbox: "pitches@animeverse.example" },
  { value: "business", label: "Advertising & partnerships", inbox: "partners@animeverse.example" },
  { value: "dmca", label: "Copyright / DMCA", inbox: "dmca@animeverse.example" },
  { value: "other", label: "Something else", inbox: "hello@animeverse.example" },
];

const inputClass =
  "w-full rounded-lg border border-border bg-input/60 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary";

export function ContactForm() {
  const [values, setValues] = useState<Fields>({ name: "", email: "", topic: "editorial", subject: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const set = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Fields;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setStatus("sending");
    const data = parsed.data;
    const inbox = topics.find((t) => t.value === data.topic)?.inbox ?? topics[0].inbox;
    const body = [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Topic: ${data.topic}`,
      "",
      data.message,
    ].join("\n");

    // No third-party mail service is connected, so the validated message is
    // handed off to the reader's mail client addressed to the right desk.
    const href = `mailto:${inbox}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`;
    window.setTimeout(() => {
      window.location.href = href;
      setStatus("sent");
    }, 350);
  };

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-primary/40 bg-primary/5 p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
        <h2 className="mt-4 font-display text-2xl font-bold">Message ready to send</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          We opened your mail client with the message pre-filled and addressed to the right desk. Hit send there and
          we'll reply within two working days.
        </p>
        <button
          onClick={() => {
            setValues({ name: "", email: "", topic: "editorial", subject: "", message: "" });
            setStatus("idle");
          }}
          className="mt-6 rounded-lg border border-border px-5 py-2.5 text-sm font-semibold hover:bg-secondary"
        >
          Write another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5 rounded-2xl border border-border/60 bg-card/40 p-6 lg:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="mb-1.5 block text-sm font-medium">Your name</label>
          <input
            id="cf-name"
            className={inputClass}
            maxLength={100}
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "cf-name-err" : undefined}
          />
          {errors.name && <p id="cf-name-err" className="mt-1.5 text-xs text-destructive">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="cf-email" className="mb-1.5 block text-sm font-medium">Email</label>
          <input
            id="cf-email"
            type="email"
            className={inputClass}
            maxLength={255}
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "cf-email-err" : undefined}
          />
          {errors.email && <p id="cf-email-err" className="mt-1.5 text-xs text-destructive">{errors.email}</p>}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-topic" className="mb-1.5 block text-sm font-medium">What is this about?</label>
          <select
            id="cf-topic"
            className={inputClass}
            value={values.topic}
            onChange={(e) => set("topic", e.target.value as Fields["topic"])}
          >
            {topics.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="cf-subject" className="mb-1.5 block text-sm font-medium">Subject</label>
          <input
            id="cf-subject"
            className={inputClass}
            maxLength={140}
            value={values.subject}
            onChange={(e) => set("subject", e.target.value)}
            aria-invalid={!!errors.subject}
            aria-describedby={errors.subject ? "cf-subject-err" : undefined}
          />
          {errors.subject && <p id="cf-subject-err" className="mt-1.5 text-xs text-destructive">{errors.subject}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="cf-message" className="mb-1.5 block text-sm font-medium">Message</label>
        <textarea
          id="cf-message"
          rows={7}
          className={inputClass}
          maxLength={4000}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "cf-message-err" : undefined}
        />
        <div className="mt-1.5 flex items-center justify-between gap-3">
          {errors.message ? (
            <p id="cf-message-err" className="text-xs text-destructive">{errors.message}</p>
          ) : (
            <p className="text-xs text-muted-foreground">Include links or episode numbers where relevant.</p>
          )}
          <span className="shrink-0 text-xs text-muted-foreground">{values.message.length}/4000</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          We use your details only to reply. See our <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>.
        </p>
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground glow-primary transition hover:brightness-110 disabled:opacity-60"
        >
          {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {status === "sending" ? "Preparing…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
