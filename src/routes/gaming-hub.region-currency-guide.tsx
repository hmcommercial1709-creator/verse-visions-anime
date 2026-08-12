import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Calculator,
  ExternalLink,
  Globe2,
} from "lucide-react";
import {
  GamingHubPage,
  HubLinkGrid,
  SourceDisclosure,
} from "@/components/gaming-hub-components";
import { platformGuides } from "@/data/gaming-hub";
import { faqSchema, gamingHubHead, howToSchema } from "@/lib/gaming-hub-seo";

const title = "Game Gift Card Regions & Currency Conversion Guide";
const description =
  "Check Steam, PlayStation, Xbox and Nintendo gift card regions, estimate currency conversion and avoid incompatible digital game codes worldwide.";

const steps = [
  {
    name: "Identify the receiving account",
    text: "Confirm the platform account that will redeem the digital code.",
  },
  {
    name: "Check the account country",
    text: "Find the country or store region recorded in the official account settings.",
  },
  {
    name: "Read the listing restrictions",
    text: "Match the product currency, supported countries, platform and activation method.",
  },
  {
    name: "Estimate total converted cost",
    text: "Use a current exchange rate from your chosen provider and include its percentage fee.",
  },
  {
    name: "Review before payment",
    text: "Recheck the live title and region because digital code errors may be difficult to reverse.",
  },
];

const faqs = [
  {
    question:
      "Can I use a US PlayStation gift card on a different account region?",
    answer:
      "PlayStation says voucher codes and the account country or region must match. Verify the account country and the voucher region before payment.",
  },
  {
    question: "Do Nintendo eShop cards work worldwide?",
    answer:
      "Nintendo states that eShop cards purchased for a particular country or region can only be redeemed by Nintendo Accounts set to that country or region.",
  },
  {
    question: "Is the calculator using a live exchange rate?",
    answer:
      "No. You enter the rate and provider fee yourself. This keeps the calculation transparent and prevents an old rate from being presented as current financial data.",
  },
];

export const Route = createFileRoute("/gaming-hub/region-currency-guide")({
  head: () =>
    gamingHubHead({
      path: "/gaming-hub/region-currency-guide",
      title,
      description,
      schemas: [
        howToSchema({
          name: "How to check a digital game card region",
          description,
          steps,
        }),
        faqSchema(faqs),
      ],
    }),
  component: RegionCurrencyGuide,
});

function RegionCurrencyGuide() {
  return (
    <GamingHubPage
      eyebrow="Worldwide account compatibility"
      title="Game Gift Card Region & Currency Conversion Guide"
      intro="Check account-country rules before buying Steam, PlayStation, Xbox or Nintendo credit, then estimate the converted cost with a transparent calculator that uses the rate and fee you provide."
    >
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <Globe2 className="h-9 w-9 text-cyan-300" />
            <h2 className="mt-5 font-display text-3xl font-black">
              Why digital game card regions matter
            </h2>
            <p className="mt-4 leading-7 text-slate-300">
              A code can be genuine and unused but still fail on an account from
              the wrong country. Platform rules, not the buyer's physical
              location alone, usually determine whether a code can be redeemed.
            </p>
            <p className="mt-4 leading-7 text-slate-400">
              Before comparing prices, identify the recipient account, its store
              country, the product currency, the exact platform and whether the
              listing describes a wallet code, game key, DLC or account-based
              top-up.
            </p>
          </div>
          <ol className="space-y-3">
            {steps.map((step, index) => (
              <li
                key={step.name}
                className="flex gap-4 rounded-2xl border border-white/10 bg-[#111827] p-5"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cyan-400/10 font-black text-cyan-300">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold">
                    {step.name}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0e1422]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <p className="text-xs font-black uppercase tracking-[.2em] text-cyan-300">
            Official rules summary
          </p>
          <h2 className="mt-3 font-display text-3xl font-black sm:text-4xl">
            Platform Region Compatibility Table
          </h2>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead className="bg-[#111827]">
                <tr>
                  <th className="p-4 font-black">Platform</th>
                  <th className="p-4 font-black">Check before purchase</th>
                  <th className="p-4 font-black">Official help</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-[#0b101c]">
                {platformGuides.slice(0, 4).map((platform) => (
                  <tr key={platform.name}>
                    <td className="p-4 font-bold text-white">
                      {platform.name}
                    </td>
                    <td className="p-4 leading-6 text-slate-300">
                      {platform.regionRule}
                    </td>
                    <td className="p-4">
                      <a
                        href={platform.officialSupport}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-bold text-cyan-300"
                      >
                        Official source <ExternalLink className="h-4 w-4" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6">
            <SourceDisclosure>
              The table summarizes official platform support. Always open the
              source and the current product listing because policies and
              supported markets may change.
            </SourceDisclosure>
          </div>
        </div>
      </section>

      <CurrencyCalculator />

      <section className="border-y border-white/10 bg-[#0e1422]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-2">
            <article className="rounded-2xl border border-amber-400/20 bg-amber-400/[.05] p-6">
              <AlertTriangle className="h-7 w-7 text-amber-300" />
              <h2 className="mt-5 font-display text-2xl font-black">
                Do not use currency conversion to bypass region rules
              </h2>
              <p className="mt-3 leading-7 text-amber-50/75">
                A favorable exchange rate does not make an incompatible code
                redeemable. Region and platform compatibility come before price
                comparison.
              </p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-[#111827] p-6">
              <h2 className="font-display text-2xl font-black">
                Compare the final payable amount
              </h2>
              <p className="mt-3 leading-7 text-slate-400">
                Include marketplace charges, payment-provider conversion, card
                fees, applicable taxes and any difference between the displayed
                currency and the account currency.
              </p>
              <Link
                to="/gaming-hub/game-codes-deals"
                className="mt-5 inline-flex items-center gap-2 font-black text-cyan-300"
              >
                Open the deal comparison guide{" "}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:py-20">
        <h2 className="font-display text-3xl font-black">
          Region and Currency FAQ
        </h2>
        <div className="mt-8 space-y-4">
          {faqs.map((faq) => (
            <article
              key={faq.question}
              className="rounded-2xl border border-white/10 bg-[#111827] p-6"
            >
              <h3 className="font-display text-xl font-bold">{faq.question}</h3>
              <p className="mt-3 leading-7 text-slate-400">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <HubLinkGrid exclude="/gaming-hub/region-currency-guide" />
    </GamingHubPage>
  );
}

function CurrencyCalculator() {
  const [amount, setAmount] = useState("50");
  const [rate, setRate] = useState("1");
  const [fee, setFee] = useState("0");
  const result = useMemo(() => {
    const source = Math.max(0, Number(amount) || 0);
    const exchange = Math.max(0, Number(rate) || 0);
    const feePercent = Math.max(0, Number(fee) || 0);
    const converted = source * exchange;
    const feeValue = converted * (feePercent / 100);
    return { converted, feeValue, total: converted + feeValue };
  }, [amount, rate, fee]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
        <div>
          <Calculator className="h-9 w-9 text-[#f47b25]" />
          <h2 className="mt-5 font-display text-3xl font-black">
            Manual Game Card Currency Calculator
          </h2>
          <p className="mt-4 leading-7 text-slate-300">
            Enter a current exchange rate from a source you trust. The
            calculator does not fetch or claim a live market rate.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="text-sm font-bold text-slate-200">
              Listed amount
              <input
                aria-label="Listed amount"
                inputMode="decimal"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#090d18] px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </label>
            <label className="text-sm font-bold text-slate-200">
              Exchange rate
              <input
                aria-label="Exchange rate"
                inputMode="decimal"
                value={rate}
                onChange={(event) => setRate(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#090d18] px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </label>
            <label className="text-sm font-bold text-slate-200">
              Provider fee %
              <input
                aria-label="Provider fee percentage"
                inputMode="decimal"
                value={fee}
                onChange={(event) => setFee(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#090d18] px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </label>
          </div>
          <div aria-live="polite" className="mt-6 grid gap-3 sm:grid-cols-3">
            <Result label="Converted amount" value={result.converted} />
            <Result label="Estimated fee" value={result.feeValue} />
            <Result label="Estimated total" value={result.total} highlight />
          </div>
          <p className="mt-5 text-xs leading-5 text-slate-500">
            Results are mathematical estimates in your chosen target currency.
            They exclude taxes and any charge not entered above.
          </p>
        </div>
      </div>
    </section>
  );
}

function Result({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${highlight ? "border-cyan-400/40 bg-cyan-400/10" : "border-white/10 bg-[#090d18]"}`}
    >
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-black">{value.toFixed(2)}</p>
    </div>
  );
}
