import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-16 pb-12">
      <section className="relative overflow-hidden rounded-[40px] border border-white/60 bg-[linear-gradient(135deg,#0f172a_0%,#12324f_44%,#0e7490_100%)] px-8 py-16 text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)] lg:px-14">
        <div className="absolute inset-y-0 right-0 hidden w-[42%] bg-[radial-gradient(circle_at_top,#67e8f9_0%,transparent_58%)] opacity-70 lg:block" />
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-200">
              FHIR R4 Interoperability Platform
            </p>
            <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[1.05] lg:text-7xl">
              Healthcare data exchange built for trust, speed, and scale.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-200">
              Connect providers, payers, and digital health applications through a
              tenant-isolated platform with FHIR-native storage, consent management,
              analytics, audit logging, and developer APIs.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink"
              >
                Launch Platform
              </Link>
              <Link
                href="/#platform"
                className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white"
              >
                Explore Capabilities
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-8 text-sm text-cyan-100">
              <div>
                <div className="text-3xl font-semibold text-white">FHIR R4</div>
                <div>Canonical data exchange</div>
              </div>
              <div>
                <div className="text-3xl font-semibold text-white">Multi-tenant</div>
                <div>Organization-level isolation</div>
              </div>
              <div>
                <div className="text-3xl font-semibold text-white">Audit-ready</div>
                <div>Write tracking on every mutation</div>
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="rounded-[32px] border border-white/15 bg-white/10 p-6 backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-200">
                Exchange Fabric
              </p>
              <div className="mt-5 grid gap-3">
                {[
                  "Patient aggregation across organizations",
                  "Consent-aware FHIR resource exchange",
                  "Webhook delivery for downstream applications",
                  "Developer portal with API key workflows",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-slate-950/25 px-4 py-3 text-sm text-slate-100"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] bg-white p-6 text-ink">
                <p className="text-sm text-slate-500">Consent opt-in governance</p>
                <p className="mt-3 text-2xl font-semibold">Policy-aware sharing</p>
              </div>
              <div className="rounded-[28px] bg-accentSoft p-6 text-ink">
                <p className="text-sm text-slate-500">Developer integrations</p>
                <p className="mt-3 text-2xl font-semibold">Secure API access</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="platform"
        className="grid gap-6 lg:grid-cols-3"
      >
        {[
          {
            title: "Unified Patient Graph",
            copy:
              "Aggregate patient, encounter, observation, consent, and claims data into a normalized interoperability layer.",
          },
          {
            title: "Operational Analytics",
            copy:
              "Track patient volume, provider network coverage, FHIR record growth, and consent adoption from the same workspace.",
          },
          {
            title: "Developer Delivery",
            copy:
              "Issue API keys, inspect usage, and route event notifications through webhook subscriptions designed for production apps.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-[32px] border border-line bg-white/85 p-8 shadow-card"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">
              Platform
            </p>
            <h2 className="mt-5 text-2xl font-semibold">{item.title}</h2>
            <p className="mt-4 text-slate-600">{item.copy}</p>
          </div>
        ))}
      </section>

      <section
        id="security"
        className="grid gap-6 rounded-[36px] border border-line bg-white/80 p-8 shadow-card lg:grid-cols-[0.95fr_1.05fr]"
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">
            Security and Compliance
          </p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight">
            Isolation, consent, and traceability are built into the architecture.
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            "Supabase RLS policies isolate every organization",
            "Audit logs capture every write operation",
            "Canonical FHIR resources preserve interoperability fidelity",
            "Role-based access supports admin, provider, payer, and developer workflows",
          ].map((item) => (
            <div key={item} className="rounded-[28px] bg-slate-50 p-5 text-sm text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section
        id="developer"
        className="rounded-[36px] border border-line bg-[linear-gradient(180deg,#ffffff_0%,#edf7fa_100%)] p-8 shadow-card"
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">
              Developer APIs
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight">
              Test FHIR endpoints and integrate external applications without exposing tenant boundaries.
            </h2>
            <p className="mt-4 max-w-2xl text-slate-600">
              The platform provides patient, observation, encounter, consent, analytics,
              webhook, and API-key workflows through Next.js route handlers and server actions.
            </p>
          </div>
          <div className="rounded-[32px] bg-slate-950 p-6 text-sm text-slate-100">
            <pre className="space-y-2 whitespace-pre-wrap">
{`GET  /api/fhir/Patient/:id
POST /api/fhir/Patient
GET  /api/fhir/Observation
POST /api/fhir/Encounter
GET  /api/analytics
POST /api/developer/api-keys`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}
