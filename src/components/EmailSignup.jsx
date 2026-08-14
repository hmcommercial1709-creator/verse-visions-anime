import React, { useState } from "react";

const EmailSignup = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setStatus("Please enter a valid email");
      return;
    }

    const subscribers = JSON.parse(localStorage.getItem("gc_subscribers") || "[]");
    subscribers.push({ email, date: new Date().toISOString() });
    localStorage.setItem("gc_subscribers", JSON.stringify(subscribers));

    setStatus("Welcome! Check your inbox!");
    setEmail("");
  };

  return (
    <div className="bg-[#1a1a2e] border-t-4 border-[#e94560] rounded-xl p-8 max-w-2xl mx-auto my-8">
      <div className="text-[#e94560] text-3xl mb-4 text-center">✉️</div>
      <h3 className="text-2xl font-bold mb-2 text-center">Enjoyed this guide?</h3>
      <p className="text-gray-400 mb-6 text-center">
        Get weekly anime watch orders, power system explainers, and merch recommendations delivered to your inbox.
      </p>

      {status === "Welcome! Check your inbox!" ? (
        <div className="text-green-400 font-bold text-lg text-center">✅ {status}</div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 bg-[#252540] border border-[#444] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#e94560] focus:outline-none"
          />
          <button
            type="submit"
            className="bg-[#e94560] text-white font-bold px-6 py-3 rounded-lg hover:scale-105 transition-transform"
          >
            Join 5,000+ Fans
          </button>
        </form>
      )}
      {status && status !== "Welcome! Check your inbox!" && (
        <p className="text-red-400 mt-2 text-sm text-center">{status}</p>
      )}
      <p className="text-gray-600 text-xs mt-4 text-center">No spam. Unsubscribe anytime.</p>
    </div>
  );
};

export default EmailSignup;