# Healthcare Interoperability Platform Architecture

## Overview

This platform is a multi-tenant healthcare interoperability system for secure exchange of healthcare data between providers, payers, and healthcare applications. It uses Next.js 15 for the application tier and Supabase for authentication, PostgreSQL, and storage. The canonical interoperability format is FHIR R4.

Primary goals:

- aggregate patient data
- support provider and payer workflows
- store canonical FHIR resources
- enforce organization-level isolation
- expose developer APIs and webhooks
- produce immutable audit trails

## Logical Layers

Presentation layer:

- `app/`
- `components/`

Application layer:

- Next.js route handlers in `app/api/**`
- server actions for trusted mutations

Domain layer:

- `services/` for business workflows

Data access layer:

- `repositories/` for Supabase queries

Shared libraries:

- `lib/supabase/`
- `lib/auth/`
- `lib/fhir/`
- `lib/validators/`

Persistence:

- Supabase PostgreSQL
- Supabase Storage

## Request Flow

```text
UI / API client
  -> route handler or server action
  -> auth guard + RBAC check
  -> service layer
  -> repository layer
  -> Supabase Postgres with RLS
  -> audit logging + webhook dispatch
```

## Multi-Tenancy

Tenant isolation is non-negotiable. Each tenant is represented by an organization. All tenant-owned rows contain `organization_id`, and all access is constrained by Supabase Row Level Security.

Rules:

- every business query is organization-scoped
- RLS is enabled on all tenant tables
- user roles are checked in code before mutations
- cross-tenant access is forbidden outside privileged admin tooling

## Security Model

Authentication:

- Supabase Auth manages identity
- application `users` table extends identity with role and tenant membership

Authorization roles:

- `admin`
- `provider`
- `payer`
- `developer`

Security controls:

- RLS for tenant isolation
- server-side role checks
- hashed API keys
- audit logging for all writes
- signed webhook delivery in later phases

## FHIR Strategy

The platform uses a hybrid model:

- relational tables for operational querying
- `fhir_resources` for canonical JSON payloads

Supported resource types:

- Patient
- Observation
- Encounter
- Condition
- Medication
- Procedure
- Claim
- Consent

Operational rows reference canonical FHIR storage where appropriate. The canonical FHIR record is the interoperability source of truth.

## Cross-Cutting Services

- `auditService`: append-only audit logs
- `analyticsService`: aggregate operational metrics
- `webhookService`: event fan-out for subscribers
- `fhirService`: validation, normalization, and persistence of FHIR resources

## Deployment Assumptions

- Next.js 15 App Router
- Node.js 20+
- Supabase-hosted PostgreSQL and Auth
- environment variables supplied through `.env.local` and deployment secrets
