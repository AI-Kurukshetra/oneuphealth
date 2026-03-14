import Link from "next/link";

const trustMetrics = [
  { value: "FHIR R4", label: "Canonical exchange" },
  { value: "Tenant RLS", label: "Organization isolation" },
  { value: "Audit Trail", label: "Every write tracked" },
];

const platformCards = [
  {
    eyebrow: "Clinical Graph",
    title: "Patient, encounter, observation, and consent records stay connected.",
    copy:
      "The platform keeps canonical FHIR payloads and operational records aligned so product teams can work with clean relational summaries without losing interoperability fidelity.",
  },
  {
    eyebrow: "Operations",
    title: "A control plane for providers, admins, and downstream integrators.",
    copy:
      "See patient growth, provider coverage, FHIR volume, and webhook readiness from the same workspace with role-aware access boundaries.",
  },
  {
    eyebrow: "Delivery",
    title: "APIs, webhooks, and audit logs are part of the product, not add-ons.",
    copy:
      "Teams can issue API keys, verify event delivery, and inspect the state of exchange workflows without building parallel tooling.",
  },
];

const securityPillars = [
  "Supabase RLS policies isolate every organization",
  "Consent-aware workflows keep data sharing explicit",
  "Canonical FHIR storage preserves source fidelity",
  "Role-aware access supports admin, provider, developer, and payer models",
];

const architectureSignals = [
  "Patient aggregation across organizations",
  "Consent-aware FHIR exchange",
  "Webhook delivery for downstream applications",
  "Developer portal for managed API access",
];

export default function HomePage() {
  return (
    <div className="space-y-20 pb-16">
      <section className="relative overflow-hidden rounded-[44px] border border-white/60 bg-[linear-gradient(140deg,#08111f_0%,#0d2237_38%,#0b5666_100%)] px-8 py-10 text-white shadow-[0_40px_120px_rgba(8,17,31,0.22)] lg:px-14 lg:py-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(103,232,249,0.18),transparent_22%),radial-gradient(circle_at_80%_18%,rgba(251,191,36,0.12),transparent_18%),radial-gradient(circle_at_78%_78%,rgba(14,165,233,0.18),transparent_24%)]" />
        <div className="absolute -left-16 top-24 h-52 w-52 rounded-full border border-white/10 bg-white/5 blur-2xl" />
        <div className="absolute bottom-[-60px] right-[-30px] h-72 w-72 rounded-full border border-cyan-300/10 bg-cyan-300/10 blur-3xl" />
        <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.34em] text-cyan-100 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-cyan-300" />
              Interoperability Operating System
            </div>
            <h1 className="mt-7 max-w-4xl text-5xl font-semibold leading-[0.98] lg:text-7xl">
              Healthcare data exchange designed like critical infrastructure.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              Connect providers, payers, and digital health applications through a multi-tenant
              platform built for canonical FHIR storage, consent control, audit readiness,
              analytics, and downstream delivery.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink shadow-[0_14px_30px_rgba(255,255,255,0.18)]"
              >
                Launch Platform
              </Link>
              <Link
                href="/pricing"
                className="rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur"
              >
                View Pricing
              </Link>
              <Link
                href="/#platform"
                className="rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur"
              >
                Explore Capabilities
              </Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {trustMetrics.map((metric) => (
                <div
                  key={metric.value}
                  className="rounded-[28px] border border-white/10 bg-white/8 px-5 py-5 backdrop-blur"
                >
                  <div className="text-2xl font-semibold text-white">{metric.value}</div>
                  <div className="mt-2 text-sm text-cyan-100">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-5">
            <div className="overflow-hidden rounded-[34px] border border-white/12 bg-slate-950/35 shadow-[0_30px_80px_rgba(2,6,23,0.28)] backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-200">
                    Signal Board
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">Exchange Fabric Health</p>
                </div>
                <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200">
                  Stable
                </div>
              </div>
              <div className="grid gap-4 p-6">
                <div className="grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
                  <div className="rounded-[28px] border border-white/8 bg-white/6 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
                      Exchange Fabric
                    </p>
                    <div className="mt-5 space-y-3">
                      {architectureSignals.map((item) => (
                        <div
                          key={item}
                          className="rounded-2xl border border-white/8 bg-slate-950/30 px-4 py-3 text-sm text-slate-100"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[28px] bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_100%)] p-5">
                    <div className="mt-4 rounded-[28px] border border-white/8 bg-slate-950/40 p-5">
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.26em] text-slate-400">
                        <span>Traffic Profile</span>
                        <span>24h</span>
                      </div>
                      <div className="mt-5 flex h-28 items-end gap-3">
                        {[42, 58, 46, 72, 64, 90, 76, 98].map((height, index) => (
                          <div key={height + index} className="flex-1 rounded-t-2xl bg-[linear-gradient(180deg,#67e8f9_0%,#0ea5e9_100%)]" style={{ height: `${height}%` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="platform" className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[36px] border border-line bg-white/90 p-8 shadow-card">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">
            Platform Overview
          </p>
          <h2 className="mt-5 text-4xl font-semibold leading-tight text-ink">
            One product surface for clinical operations, interoperability, and partner delivery.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
            The platform keeps operational records close to canonical FHIR resources, so teams can
            move quickly in the application while preserving exchange integrity for external
            systems.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[28px] bg-slate-950 p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
                Tenant Workspace
              </p>
              <p className="mt-3 text-2xl font-semibold">Single operational control plane</p>
            </div>
            <div className="rounded-[28px] border border-line bg-slate-50 p-6 text-ink">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                Delivery Surface
              </p>
              <p className="mt-3 text-2xl font-semibold">APIs, charts, audit, and webhook visibility</p>
            </div>
          </div>
        </div>
        <div className="grid gap-6">
          {platformCards.map((item) => (
            <div
              key={item.title}
              className="rounded-[34px] border border-line bg-[linear-gradient(180deg,rgba(255,255,255,0.95)_0%,rgba(248,251,253,0.88)_100%)] p-8 shadow-card"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">
                {item.eyebrow}
              </p>
              <h3 className="mt-4 text-2xl font-semibold text-ink">{item.title}</h3>
              <p className="mt-4 text-slate-600 leading-7">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="security"
        className="overflow-hidden rounded-[38px] border border-line bg-[linear-gradient(135deg,#ffffff_0%,#f3f8fb_45%,#ecf7f7_100%)] p-8 shadow-card lg:p-10"
      >
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">
              Security and Compliance
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight text-ink">
              Isolation, consent, and traceability are engineered into the default path.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              Teams do not have to bolt on governance after the product works. Tenant boundaries,
              audit capture, and FHIR fidelity are part of the normal application flow.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {securityPillars.map((item, index) => (
              <div
                key={item}
                className={`rounded-[28px] p-5 text-sm leading-7 ${
                  index % 2 === 0
                    ? "bg-white text-slate-700 shadow-[0_18px_40px_rgba(15,23,42,0.06)]"
                    : "bg-slate-950 text-slate-100"
                }`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="developer"
        className="rounded-[38px] border border-line bg-[linear-gradient(180deg,#fffef8_0%,#fdf6ec_100%)] p-8 shadow-card lg:p-10"
      >
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">
              Developer APIs
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight text-ink">
              A product-facing interface for engineering teams, not just an internal backdoor.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
              Test FHIR endpoints, issue API keys, and connect downstream systems through route
              handlers and webhook delivery without breaking tenant boundaries.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <div className="rounded-full border border-amber-300/60 bg-white px-4 py-2 text-sm font-medium text-amber-900">
                API key workflows
              </div>
              <div className="rounded-full border border-amber-300/60 bg-white px-4 py-2 text-sm font-medium text-amber-900">
                FHIR Patient / Observation / Encounter
              </div>
              <div className="rounded-full border border-amber-300/60 bg-white px-4 py-2 text-sm font-medium text-amber-900">
                Webhook delivery attempts
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-[34px] border border-slate-900/10 bg-slate-950 p-6 text-sm text-slate-100 shadow-[0_24px_60px_rgba(15,23,42,0.16)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
                Endpoint Surface
              </p>
              <div className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">
                JSON APIs
              </div>
            </div>
            <pre className="mt-5 whitespace-pre-wrap leading-8 text-slate-100">{`GET  /api/fhir/Patient/:id
POST /api/fhir/Patient
GET  /api/fhir/Observation
POST /api/fhir/Observation
GET  /api/fhir/Encounter
POST /api/fhir/Encounter
GET  /api/analytics
POST /api/developer/api-keys`}</pre>
          </div>
        </div>
      </section>
    </div>
  );
}
