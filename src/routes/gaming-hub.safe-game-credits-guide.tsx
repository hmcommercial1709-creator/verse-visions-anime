import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertOctagon,
  ArrowRight,
  BadgeCheck,
  ExternalLink,
  LockKeyhole,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";
import {
  GamingHubPage,
  HubLinkGrid,
  SourceDisclosure,
} from "@/components/gaming-hub-components";
import { platformGuides } from "@/data/gaming-hub";
import { faqSchema, gamingHubHead, howToSchema } from "@/lib/gaming-hub-seo";

const title = "How to Buy Game Credits Safely | Global Guide";
const description =
  "Use a practical safety checklist for instant game credits, gift cards and digital codes: platform, region, seller, delivery, payment and redemption checks.";

const safetySteps = [
  {
    name: "Define the exact product",
    text: "Write down the game, platform, edition, credit type and recipient account before searching.",
  },
  {
    name: "Match the account region",
    text: "Compare the account country with the digital code or top-up restrictions.",
  },
  {
    name: "Read the complete listing",
    text: "Inspect activation, delivery, seller and support information instead of relying on the card title.",
  },
  {
    name: "Protect account credentials",
    text: "Never provide a password or one-time authentication code to complete an ordinary gift card purchase.",
  },
  {
    name: "Review the final total",
    text: "Check currency conversion, marketplace fees, taxes and payment costs before confirmation.",
  },
  {
    name: "Save transaction evidence",
    text: "Keep the listing title, receipt and redemption instructions until the credit is successfully applied.",
  },
];

const faqs = [
  {
    question: "What does instant game card delivery mean?",
    answer:
      "It generally describes a digital delivery method, not a guaranteed number of seconds. Read the current seller's estimated delivery and verification requirements before payment.",
  },
  {
    question: "Should a seller ask for my game account password?",
    answer:
      "A normal gift card code does not require you to share your password with a seller. Account-based top-ups may require a player ID or server, but never disclose passwords or one-time authentication codes.",
  },
  {
    question: "What if a digital code does not activate?",
    answer:
      "Do not expose the code publicly. Capture the exact error, recheck platform and region, review transaction history, then use the marketplace and official platform support paths shown on the receipt or listing.",
  },
];

export const Route = createFileRoute("/gaming-hub/safe-game-credits-guide")({
  head: () =>
    gamingHubHead({
      path: "/gaming-hub/safe-game-credits-guide",
      title,
      description,
      schemas: [
        howToSchema({
          name: "How to buy digital game credits safely",
          description,
          steps: safetySteps,
        }),
        faqSchema(faqs),
      ],
    }),
  component: SafeGameCreditsGuide,
});

function SafeGameCreditsGuide() {
  return (
    <GamingHubPage
      eyebrow="Digital purchase safety"
      title="How to Buy Game Credits Safely"
      intro="Follow a repeatable checklist for wallet codes, game keys and account top-ups so fast delivery does not come at the cost of platform compatibility, account security or purchase evidence."
    >
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid gap-5 lg:grid-cols-3">
          {[
            [
              LockKeyhole,
              "Protect login secrets",
              "A gift card purchase should never require your password, backup codes or one-time authentication code.",
            ],
            [
              ShieldCheck,
              "Match before paying",
              "Confirm platform, edition, currency, account country and activation method on the full listing.",
            ],
            [
              ReceiptText,
              "Keep evidence",
              "Retain the receipt, product title and error details until the code or credit is confirmed.",
            ],
          ].map(([Icon, itemTitle, text]) => {
            const ItemIcon = Icon as typeof LockKeyhole;
            return (
              <article
                key={itemTitle as string}
                className="rounded-2xl border border-white/10 bg-[#111827] p-6"
              >
                <ItemIcon className="h-7 w-7 text-cyan-300" />
                <h2 className="mt-5 font-display text-2xl font-black">
                  {itemTitle as string}
                </h2>
                <p className="mt-3 leading-7 text-slate-400">
                  {text as string}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0e1422]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <p className="text-xs font-black uppercase tracking-[.2em] text-cyan-300">
            Six-step checklist
          </p>
          <h2 className="mt-3 font-display text-3xl font-black sm:text-4xl">
            Safe Digital Game Credit Purchase Process
          </h2>
          <ol className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {safetySteps.map((step, index) => (
              <li
                key={step.name}
                className="rounded-2xl border border-white/10 bg-[#111827] p-6"
              >
                <span className="text-sm font-black text-[#f47b25]">
                  STEP {index + 1}
                </span>
                <h3 className="mt-4 font-display text-xl font-bold">
                  {step.name}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <AlertOctagon className="h-9 w-9 text-rose-400" />
            <h2 className="mt-5 font-display text-3xl font-black">
              Warning signs before checkout
            </h2>
            <p className="mt-4 leading-7 text-slate-300">
              Stop and investigate when the product cannot be identified clearly
              or the requested information exceeds what is needed for delivery.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              [
                "Password request",
                "Never send an account password, email password or authentication code.",
              ],
              [
                "Missing platform",
                "A title without Steam, PlayStation, Xbox or Nintendo compatibility is incomplete.",
              ],
              [
                "Unclear region",
                "If the code region is missing, do not assume that “global” applies.",
              ],
              [
                "Off-platform payment",
                "Do not follow a seller request to pay through an unrelated private channel.",
              ],
              [
                "Guaranteed impossible discount",
                "Treat extraordinary claims as unverified until the live checkout proves them.",
              ],
              [
                "No support route",
                "Know who handles delivery and activation issues before paying.",
              ],
            ].map(([warning, text]) => (
              <article
                key={warning}
                className="rounded-2xl border border-rose-400/15 bg-rose-400/[.045] p-5"
              >
                <h3 className="font-display text-lg font-bold text-rose-200">
                  {warning}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0e1422]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          <h2 className="font-display text-3xl font-black">
            Official redemption and troubleshooting paths
          </h2>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-[#111827]">
                <tr>
                  <th className="p-4">Platform</th>
                  <th className="p-4">Primary pre-purchase check</th>
                  <th className="p-4">Support</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {platformGuides.slice(0, 5).map((platform) => (
                  <tr key={platform.name}>
                    <td className="p-4 font-bold">{platform.name}</td>
                    <td className="p-4 leading-6 text-slate-400">
                      {platform.regionRule}
                    </td>
                    <td className="p-4">
                      <a
                        href={platform.officialSupport}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-bold text-cyan-300"
                      >
                        Official help <ExternalLink className="h-4 w-4" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6">
            <SourceDisclosure>
              Official support pages explain redemption rules. The marketplace
              handles its transaction and seller support; the platform handles
              account and redemption systems.
            </SourceDisclosure>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:py-20">
        <BadgeCheck className="h-8 w-8 text-cyan-300" />
        <h2 className="mt-5 font-display text-3xl font-black">
          Safe Game Credits FAQ
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
        <Link
          to="/gaming-hub/region-currency-guide"
          className="mt-8 inline-flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 font-black text-cyan-200"
        >
          Check region and currency compatibility{" "}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <HubLinkGrid exclude="/gaming-hub/safe-game-credits-guide" />
    </GamingHubPage>
  );
}
