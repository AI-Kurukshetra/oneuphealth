import Link from "next/link";

const plans = [
  {
    name: "Launch",
    price: "$499",
    cadence: "/month",
    description:
      "For small provider teams validating their first FHIR workflows and internal dashboards.",
    accent: "border-slate-200 bg-white",
    cta: "Start Launch Plan",
    featured: false,
    features: [
      "1 organization workspace",
      "Patient, provider, and consent workflows",
      "FHIR Patient, Observation, Encounter, and Consent APIs",
      "Basic analytics dashboard",
      "Email support during business hours",
    ],
  },
  {
    name: "Growth",
    price: "$1,999",
    cadence: "/month",
    description:
      "For interoperability teams running production integrations and downstream delivery to partners.",
    accent:
      "border-cyan-300/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(236,254,255,0.95)_100%)]",
    cta: "Choose Growth",
    featured: true,
    features: [
      "Everything in Launch",
      "API key management and webhook delivery",
      "Role-aware access for admin, provider, developer, and payer models",
      "Audit-ready event tracking",
      "Priority implementation support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "engagement",
    description:
      "For organizations planning payer-provider exchange programs, security reviews, and custom integration work.",
    accent: "border-slate-900/10 bg-slate-950 text-white",
    cta: "Talk to Architecture",
    featured: false,
    features: [
      "Everything in Growth",
      "Custom integration roadmap",
      "Architecture and compliance review support",
      "Dedicated onboarding and solution design",
      "Commercial terms aligned to deployment scope",
    ],
  },
];

const comparisonRows = [
  {
    capability: "FHIR API access",
    launch: "Core resources",
    growth: "Core + managed delivery",
    enterprise: "Custom resource roadmap",
  },
  {
    capability: "Consent workflows",
    launch: "Create and manage",
    growth: "Audit-oriented operations",
    enterprise: "Custom governance support",
  },
  {
    capability: "Analytics",
    launch: "Operational dashboard",
    growth: "Dashboard + integration visibility",
    enterprise: "Executive reporting support",
  },
  {
    capability: "Support model",
    launch: "Email",
    growth: "Priority support",
    enterprise: "Dedicated planning",
  },
];

const faqItems = [
  {
    question: "When does billing begin?",
    answer:
      "The platform is free to use during the current early-access period. Paid pricing becomes effective on April 1, 2026.",
  },
  {
    question: "Does pricing include hosted Supabase infrastructure?",
    answer:
      "No. Infrastructure, compliance posture, and production environment ownership should be scoped separately based on deployment requirements.",
  },
  {
    question: "Can we start on Growth and move to Enterprise later?",
    answer:
      "Yes. The plans are designed so teams can validate workflows first, then expand into custom integrations and governance work as the platform matures.",
  },
  {
    question: "Do all plans include the developer portal?",
    answer:
      "Launch includes the basic surface. Growth and Enterprise are better suited once teams depend on API keys, webhooks, and partner testing workflows.",
  },
];

export default function PricingPage() {
  return (
    <div className="space-y-16 pb-16">
      <section className="relative overflow-hidden rounded-[42px] border border-white/60 bg-[linear-gradient(135deg,#08111f_0%,#10243a_34%,#155e75_100%)] px-8 py-12 text-white shadow-[0_40px_120px_rgba(8,17,31,0.2)] lg:px-14 lg:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(103,232,249,0.18),transparent_24%),radial-gradient(circle_at_82%_20%,rgba(251,191,36,0.12),transparent_20%),radial-gradient(circle_at_78%_80%,rgba(14,165,233,0.2),transparent_24%)]" />
        <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-200">Pricing</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.02] lg:text-6xl">
              Commercial tiers for interoperability teams, not generic SaaS seats.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              Choose a plan based on the exchange surface you need today: operational workflows,
              FHIR APIs, delivery tooling, and the level of architecture support your team requires.
            </p>
            <div className="mt-6 inline-flex rounded-full border border-rose-300/50 bg-rose-500/15 px-4 py-2 text-sm font-semibold text-rose-100 backdrop-blur">
              Free during early access. Listed pricing becomes effective on April 1, 2026.
            </div>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink shadow-[0_14px_30px_rgba(255,255,255,0.16)]"
              >
                Request Access
              </Link>
              <Link
                href="#plans"
                className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur"
              >
                Compare Plans
              </Link>
            </div>
          </div>
          <div className="grid gap-4 rounded-[34px] border border-white/10 bg-slate-950/35 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
                  Buying Signals
                </p>
                <p className="mt-2 text-lg font-semibold text-white">Typical fit by team stage</p>
              </div>
              <div className="rounded-full bg-rose-500/15 px-3 py-1 text-xs font-semibold text-rose-100">
                Early access
              </div>
            </div>
            <div className="rounded-[24px] border border-rose-300/30 bg-rose-500/12 px-4 py-4 text-sm leading-6 text-rose-100">
              Teams can onboard now without charges. Commercial billing starts on April 1, 2026,
              based on the tier selected for production use.
            </div>
            <div className="grid gap-3">
              {[
                ["Launch", "Pilots and internal enablement"],
                ["Growth", "Production integration teams"],
                ["Enterprise", "Custom exchange and compliance programs"],
              ].map(([label, description]) => (
                <div key={label} className="rounded-[24px] border border-white/8 bg-white/6 px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-base font-semibold text-white">{label}</p>
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-200">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="plans" className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={`relative overflow-hidden rounded-[34px] border p-8 shadow-card ${plan.accent}`}
          >
            {plan.featured ? (
              <div className="absolute right-5 top-5 rounded-full bg-cyan-500 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                Recommended
              </div>
            ) : null}
            <p className={`text-sm font-semibold uppercase tracking-[0.28em] ${plan.featured ? "text-accent" : plan.name === "Enterprise" ? "text-cyan-200" : "text-slate-500"}`}>
              {plan.name}
            </p>
            <div className="mt-5 flex items-end gap-2">
              <span className="text-5xl font-semibold">{plan.price}</span>
              <span className={`pb-1 text-sm ${plan.name === "Enterprise" ? "text-slate-300" : "text-slate-500"}`}>
                {plan.cadence}
              </span>
            </div>
            <p className={`mt-2 text-xs font-semibold uppercase tracking-[0.2em] ${plan.name === "Enterprise" ? "text-rose-200" : "text-rose-700"}`}>
              Effective April 1, 2026
            </p>
            <p className={`mt-5 leading-7 ${plan.name === "Enterprise" ? "text-slate-300" : "text-slate-600"}`}>
              {plan.description}
            </p>
            <ul className="mt-8 space-y-3 text-sm leading-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className={`mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${plan.name === "Enterprise" ? "bg-white/10 text-cyan-200" : "bg-cyan-100 text-accent"}`}>
                    ✓
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/login"
              className={`mt-8 inline-flex rounded-full px-5 py-3 text-sm font-semibold ${plan.name === "Enterprise" ? "bg-white text-ink" : plan.featured ? "bg-ink text-white" : "border border-line bg-white text-ink"}`}
            >
              {plan.cta}
            </Link>
          </article>
        ))}
      </section>

      <section className="rounded-[38px] border border-line bg-[linear-gradient(180deg,#ffffff_0%,#f6fbfd_100%)] p-8 shadow-card lg:p-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">Feature Comparison</p>
            <h2 className="mt-4 text-4xl font-semibold text-ink">What changes between plans</h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">
            The product surface stays consistent. The main difference is how much delivery tooling,
            support, and implementation depth your team requires.
          </p>
        </div>
        <div className="mt-8 overflow-hidden rounded-[28px] border border-line">
          <div className="grid grid-cols-[1.2fr_repeat(3,1fr)] bg-slate-950 px-5 py-4 text-sm font-semibold text-white">
            <div>Capability</div>
            <div>Launch</div>
            <div>Growth</div>
            <div>Enterprise</div>
          </div>
          {comparisonRows.map((row, index) => (
            <div
              key={row.capability}
              className={`grid grid-cols-[1.2fr_repeat(3,1fr)] px-5 py-4 text-sm ${
                index % 2 === 0 ? "bg-white" : "bg-slate-50"
              }`}
            >
              <div className="font-semibold text-ink">{row.capability}</div>
              <div className="text-slate-600">{row.launch}</div>
              <div className="text-slate-600">{row.growth}</div>
              <div className="text-slate-600">{row.enterprise}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[34px] border border-line bg-white p-8 shadow-card">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">Included Features</p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight text-ink">
            Every plan keeps the core exchange platform intact.
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              "Tenant-aware authentication",
              "Role-based navigation",
              "FHIR canonical resource storage",
              "Patient, provider, and consent operations",
              "Analytics workspace",
              "Developer API surface",
            ].map((item) => (
              <div key={item} className="rounded-[24px] border border-line bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[34px] border border-line bg-[linear-gradient(180deg,#fffef8_0%,#fdf6ec_100%)] p-8 shadow-card">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">Frequently Asked</p>
          <div className="mt-6 space-y-4">
            {faqItems.map((item) => (
              <div key={item.question} className="rounded-[24px] border border-amber-200/80 bg-white px-5 py-5">
                <h3 className="text-lg font-semibold text-ink">{item.question}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
