# MVP Task Board

This board converts `docs/mvp-remediation-roadmap.md` into an execution queue.

Status key:

- `Must Have Now`: required to make the stated MVP technically credible
- `Phase 5`: next implementation phase after the current completed work
- `Phase 6`: follows Phase 5 and depends on its output
- `Later`: important, but not the first execution slice

## Must Have Now

### FHIR Gateway

- [x] Replace the static FHIR resource catalog with an implemented resource registry.
- [x] Stop advertising unsupported FHIR resource routes.
- [x] Add generic `GET/POST` FHIR routing by resource type.
- [x] Add generic `GET/PUT/DELETE` FHIR routing by resource id.
- [x] Return native FHIR resource bodies instead of `{ data: ... }` for resource fetches.
- [x] Return FHIR `Bundle` responses for collection and search endpoints.

### External Aggregation

- [ ] Create connector framework interfaces for external healthcare sources.
- [ ] Add integration source and import job database tables.
- [ ] Build one working ingestion adapter.
- [ ] Track source provenance for imported patient records.

### Payer-Provider Exchange

- [ ] Add payer-facing API surface.
- [ ] Seed and verify a payer user flow.
- [ ] Implement one provider-to-payer retrieval or delivery workflow.
- [ ] Add consent-aware release checks to the exchange path.
- [ ] Add exchange transaction logging.

### Consent

- [ ] Add consent revoke API.
- [ ] Add consent revoke action in UI.
- [ ] Add consent history/version tracking.
- [ ] Enforce consent checks before outbound exchange.

### Documentation

- [ ] Publish machine-readable API documentation.
- [ ] Add FHIR support matrix and real request/response examples.
- [x] Remove stale documentation claims that exceed implementation.

## Phase 5

### Gateway Hardening

- [x] Create `lib/fhir/registry.ts`.
- [x] Refactor resource-specific route handlers toward generic route composition.
- [x] Extract FHIR Bundle builder helpers.
- [ ] Add resource search parameter parsing for implemented resources.
- [x] Add explicit unsupported-operation responses.

### Security

- [ ] Add webhook secret generation and storage flow.
- [ ] Add webhook request signing strategy.
- [ ] Add API key revoke flow.
- [ ] Add admin audit visibility page.

### Tests

- [ ] Add service-layer tests for RBAC.
- [ ] Add service-layer tests for FHIR normalization.
- [ ] Add service-layer tests for consent policy decisions.

## Phase 6

### External Source Expansion

- [ ] Build a second connector after the first ingestion path is stable.
- [ ] Add import deduplication and reconciliation rules.
- [ ] Add integration readiness matrix in docs.
- [ ] Add operational monitoring for import jobs.

### Payer Exchange Expansion

- [ ] Add payer encounter retrieval endpoint.
- [ ] Add payer patient observation retrieval endpoint.
- [ ] Add claim or coverage persistence design.
- [ ] Decide whether payer exchange is pull-based, push-based, or both.

### Compliance Evidence

- [ ] Publish security runbook.
- [ ] Publish HIPAA control matrix.
- [ ] Add environment hardening checklist.
- [ ] Add webhook failure and access-denial observability.

## Later

### Business Scale Features

- [ ] Expand connector coverage toward the target 23-source roadmap.
- [ ] Add full Claim resource support.
- [ ] Add Coverage resource support if payer workflows require it.
- [ ] Add Condition, Medication, and Procedure end-to-end support.
- [ ] Add richer developer analytics backed by real traffic data.

### Product and Operations

- [ ] Add full admin management UI.
- [ ] Add webhook management UI beyond registration.
- [ ] Add organization administration workflows.
- [ ] Add incident response and production operations documentation.
- [ ] Add end-to-end seeded regression suite for release signoff.

## Recommended First Sprint

The recommended first sprint should include only the tasks that unblock the real MVP gap closure:

1. Replace the static FHIR catalog with implemented resource registry.
2. Add generic FHIR route architecture.
3. Create integration source and import job tables.
4. Build one working ingestion adapter.
5. Add payer-facing API surface.
6. Implement one provider-to-payer exchange workflow.

## Related Docs

- `docs/mvp-remediation-roadmap.md`
- `docs/phase-plan.md`
- `docs/architecture.md`
