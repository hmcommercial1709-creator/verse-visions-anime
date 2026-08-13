import React, { useState } from "react";

const STORAGE_KEY = "gamecastle_subscribers";

const EmailSignup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic validation: must contain '@'
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list: string[] = raw ? JSON.parse(raw) : [];

      // avoid duplicates
      if (!list.includes(email)) {
        list.push(email);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      }

      setSuccess("Welcome! Check your inbox!");
      setEmail("");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="rounded-xl bg-[#1a1a2e] border-t-4 border-[#e94560] p-6">
        <h3 className="text-white font-bold text-xl">Enjoyed this guide?</h3>
        <p className="text-gray-300 text-sm mt-2">
          Get weekly anime watch orders, power system explainers, and merch recommendations delivered to your inbox.
        </p>

        <form onSubmit={handleSubmit} className="mt-4" aria-label="Email signup form">
          <label htmlFor="email" className="sr-only">
            Email address
          </label>

          <div className="flex gap-3">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 bg-[#252540] border border-[#444] text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e94560]/40"
              aria-invalid={!!error}
              aria-describedby={error ? "email-error" : success ? "email-success" : undefined}
            />

            <button
              type="submit"
              className="bg-[#e94560] text-white rounded-lg px-4 py-3 font-semibold hover:brightness-95 transition"
            >
              Join 5,000+ Fans
            </button>
          </div>

          {error && (
            <p id="email-error" className="text-sm text-red-400 mt-2">
              {error}
            </p>
          )}

          {success && (
            <p id="email-success" className="text-sm text-green-400 mt-2">
              {success}
            </p>
          )}

          <p className="text-gray-500 text-xs mt-3">No spam. Unsubscribe anytime.</p>
        </form>
      </div>
    </div>
  );
};

export default EmailSignup;
