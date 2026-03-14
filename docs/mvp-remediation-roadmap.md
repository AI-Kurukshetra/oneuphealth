# MVP Remediation Roadmap

## Audit Summary

Current platform status:

- implemented: tenant-aware auth, RBAC, RLS, audit logging, patient/provider/consent workflows, partial FHIR APIs, developer API keys, dashboard, analytics, webhook delivery attempts
- partial: FHIR gateway semantics, consent lifecycle, HIPAA-oriented controls, developer documentation
- missing: external EHR aggregation, real payer-provider exchange workflow, claims/coverage path, machine-readable API contracts

This roadmap converts the audit findings into dependency-ordered implementation work for achieving the stated MVP.

## MVP Completion Criteria

The product should only be considered MVP-complete when all of the following are true:

1. At least one external healthcare source can import patient data into the platform.
2. At least one payer-facing workflow can retrieve or receive provider-generated data.
3. Supported FHIR resources use consistent CRUD and search behavior.
4. Consent can be created, updated, revoked, and audited.
5. Tenant isolation and audit logging are enforced in production paths.
6. Developer documentation is sufficient for a third party to integrate without reading source code.
7. Dashboard metrics are based on real persisted data for the active organization.

## Delivery Order

Implementation should happen in this order:

1. FHIR gateway hardening
2. External connector framework
3. One real ingestion path
4. One payer-provider exchange workflow
5. Consent lifecycle completion
6. Security and HIPAA evidence improvements
7. Developer documentation and API contracts
8. Automated test coverage

## Dependency-Ordered Backlog

### Track A: FHIR Gateway Hardening

#### A1. Replace static FHIR catalog with implemented resource registry
Status: required before external integrations

Deliverables:
- central registry of supported FHIR resource handlers
- `/api/fhir` returns only implemented resource types
- remove misleading references to unsupported route coverage

Suggested files:
- `lib/fhir/registry.ts`
- `app/api/fhir/route.ts`

Acceptance criteria:
- catalog output matches actual route support
- unsupported resource types return explicit 501 or 400 responses

#### A2. Implement generic FHIR resource routes
Status: blocker for gateway completeness

Deliverables:
- `GET /api/fhir/[resourceType]`
- `POST /api/fhir/[resourceType]`
- `GET /api/fhir/[resourceType]/[id]`
- `PUT /api/fhir/[resourceType]/[id]`
- `DELETE /api/fhir/[resourceType]/[id]`

Suggested files:
- `app/api/fhir/[resourceType]/route.ts`
- `app/api/fhir/[resourceType]/[id]/route.ts`
- `services/fhirGatewayService.ts`

Acceptance criteria:
- supported resource types use consistent route behavior
- route handlers are resource-agnostic where possible
- audit and webhook side effects still occur on writes

#### A3. Return native FHIR payloads and Bundle responses
Status: required for a valid FHIR gateway claim

Deliverables:
- single-resource responses return native FHIR resource JSON
- collection/search responses return FHIR `Bundle`
- error shape documented separately from FHIR success payloads

Suggested files:
- `lib/fhir/bundle.ts`
- `lib/fhir/search.ts`
- `docs/fhir-examples.md`

Acceptance criteria:
- `GET /api/fhir/Observation` returns a Bundle
- `GET /api/fhir/Patient/:id` returns a Patient resource body
- examples are documented

### Track B: External Aggregation

#### B1. Introduce connector framework
Status: blocker for any EHR aggregation claim

Deliverables:
- pluggable connector interface
- integration source configuration model
- import job tracking model

Suggested files:
- `integrations/ehr/base/EhrConnector.ts`
- `services/aggregation/patientAggregationService.ts`
- `repositories/integrationRepository.ts`
- `repositories/importJobRepository.ts`

Database changes:
- add `database/migrations/003_integration_sources.sql`

Acceptance criteria:
- system can register integration sources
- import jobs can be created, tracked, and audited

#### B2. Build one working ingestion adapter
Status: MVP-critical

Recommended first adapter:
- `MockEhrConnector` or structured CSV/JSON ingestion

Recommended second adapter:
- vendor-shaped adapter such as `EpicConnector`

Deliverables:
- source-to-platform patient normalization
- provenance/source link tracking
- idempotent import behavior

Suggested files:
- `integrations/ehr/mock/MockEhrConnector.ts`
- `integrations/ehr/epic/EpicConnector.ts`
- `services/aggregation/sourceNormalizationService.ts`

Acceptance criteria:
- imported patient data creates or updates platform patient records
- source identifiers are retained
- import activity is auditable

#### B3. Define roadmap for 23-source scaling
Status: not required for first technical proof, required for business claim

Deliverables:
- list of target systems
- adapter readiness matrix
- connector certification checklist

Suggested docs:
- `docs/integration-matrix.md`

Acceptance criteria:
- each future connector has defined contract and rollout path

### Track C: Payer-Provider Exchange

#### C1. Add payer-facing access model
Status: blocker for exchange workflow

Deliverables:
- payer-specific APIs or views
- payer role restrictions and allowed resources
- seeded payer test user and organization context

Suggested files:
- `services/payerAccessService.ts`
- `app/api/payer/route.ts`
- `app/api/payer/encounters/route.ts`

Acceptance criteria:
- payer user can authenticate
- payer user can access only permitted exchange endpoints

#### C2. Implement one provider-to-payer data exchange workflow
Status: core MVP requirement

Recommended workflow:
- provider creates patient and encounter
- platform stores canonical FHIR resources
- payer retrieves encounter summary or receives webhook event

Deliverables:
- payer retrieval API or outbound payer adapter
- consent-aware exchange check before release
- exchange transaction audit trail

Suggested files:
- `services/payerExchangeService.ts`
- `integrations/payer/demoPayerAdapter.ts`
- `app/api/payer/patients/[id]/observations/route.ts`

Database changes:
- add `database/migrations/004_payer_exchange.sql`

Acceptance criteria:
- one end-to-end provider-to-payer scenario works in QA
- exchange is organization-scoped and auditable

#### C3. Add claims or coverage surface for payer workflows
Status: likely required if business MVP is payer-focused

Deliverables:
- claim or coverage persistence model
- payer-consumable retrieval path
- FHIR Claim alignment if chosen

Suggested files:
- `services/claimService.ts`
- `repositories/claimRepository.ts`
- `app/api/fhir/Claim/route.ts`

Database changes:
- add `database/migrations/005_claims_and_coverage.sql`

Acceptance criteria:
- at least one payer-relevant business object exists beyond generic patient retrieval

### Track D: Consent Lifecycle Completion

#### D1. Add consent revoke flow
Status: required for healthcare workflow credibility

Deliverables:
- revoke endpoint
- revoke action in UI
- audit event `consent.revoked`

Suggested files:
- `app/api/consent/[id]/revoke/route.ts`
- `app/consent/[id]/history/page.tsx`
- `services/consentPolicyService.ts`

Acceptance criteria:
- active consent can be revoked
- revoked consent is excluded from active sharing logic

#### D2. Add consent history/version tracking
Status: required for traceability

Deliverables:
- versioned consent history records
- timeline UI or API

Database changes:
- add `database/migrations/006_consent_history.sql`

Acceptance criteria:
- all consent changes are queryable historically

#### D3. Enforce consent checks on outbound exchange
Status: required before payer or external release

Deliverables:
- policy check before webhook or payer release
- explicit failure reason when consent blocks exchange

Acceptance criteria:
- blocked exchange attempts are logged
- permitted exchange attempts are auditable

### Track E: Security and HIPAA Evidence

#### E1. Publish security runbook and control matrix
Status: required for compliance credibility

Deliverables:
- security operations runbook
- HIPAA control mapping for current system
- environment hardening checklist

Suggested docs:
- `docs/security-runbook.md`
- `docs/hipaa-controls-matrix.md`

Acceptance criteria:
- engineering and operations responsibilities are documented
- current code controls are mapped to compliance controls

#### E2. Improve secret and webhook protection
Status: recommended before partner onboarding

Deliverables:
- webhook secret generation and hashing
- request signature validation documentation
- API key rotation/revoke flow

Suggested files:
- `services/webhookSigningService.ts`
- `app/api/developer/api-keys/[id]/revoke/route.ts`

Acceptance criteria:
- webhook subscriptions can use secrets
- API keys can be revoked safely

#### E3. Add security observability
Status: recommended before production rollout

Deliverables:
- admin audit view
- failed webhook delivery visibility
- auth and access denial metrics

Acceptance criteria:
- operational staff can inspect security-relevant events without SQL access

### Track F: Documentation and Developer Experience

#### F1. Add OpenAPI contract
Status: required for serious integrator handoff

Deliverables:
- `docs/openapi.yaml`
- route coverage for REST APIs
- authentication examples

Acceptance criteria:
- third-party developer can import the spec into Postman or Swagger UI

#### F2. Add FHIR examples and support matrix
Status: required for interoperability clarity

Deliverables:
- supported resource matrix
- sample request/response payloads
- list of unsupported FHIR interactions

Suggested docs:
- `docs/fhir-examples.md`
- `docs/fhir-support-matrix.md`

Acceptance criteria:
- developer docs no longer overstate support

#### F3. Refresh stale internal docs
Status: immediate cleanup

Deliverables:
- update manual QA plan
- update API spec
- update architecture docs to distinguish current vs target state

Acceptance criteria:
- no doc claims unsupported functionality

### Track G: Test Coverage

#### G1. Service-layer unit tests
Status: required before expanding integrations

Priority areas:
- RBAC enforcement
- consent policy decisions
- FHIR normalization and reference validation
- import deduplication

Suggested files:
- `tests/services/*.test.ts`

#### G2. API integration tests
Status: required before partner demos

Priority areas:
- FHIR route behavior
- consent revoke and history
- payer retrieval endpoints
- webhook registration and delivery attempts

Suggested files:
- `tests/api/*.test.ts`

#### G3. End-to-end seeded flows
Status: required before MVP signoff

Priority flows:
- login/logout
- create patient/provider/consent
- run FHIR create and retrieval
- run one ingestion job
- verify payer retrieval path

Suggested files:
- `tests/e2e/*.spec.ts`

## Recommended Next Execution Slice

If engineering starts immediately, the most efficient next slice is:

1. A1: FHIR registry cleanup
2. A2: generic FHIR route framework
3. B1: connector framework tables and services
4. B2: one ingestion adapter
5. C1: payer access model
6. C2: one payer-provider exchange workflow

## Database Migration Plan

The next SQL files should be created in this order:

1. `003_integration_sources.sql`
2. `004_payer_exchange.sql`
3. `005_claims_and_coverage.sql`
4. `006_consent_history.sql`

## Definition of Done for MVP Audit Re-Run

The audit should be re-run only after all of the following are present:

- one real connector path exists
- one payer exchange workflow exists
- FHIR routes support consistent CRUD/search behavior for supported resources
- consent revoke/history is implemented
- docs accurately describe real capabilities
- automated coverage exists for the new exchange paths
