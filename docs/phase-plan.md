# Delivery Phase Plan

## Completed Phases

### Phase 1

- scaffold project structure
- create architecture and implementation docs
- add initial database migration and RLS

### Phase 2

- implement repositories and services
- implement audit logging and webhook dispatch
- add FHIR resource engine

### Phase 3

- build REST and FHIR APIs
- add server actions for UI workflows
- add validation and role guards

### Phase 4

- build dashboard, patient, provider, consent, analytics, and developer pages
- add reusable tables, forms, and charts

## Post-Audit MVP Closure Phases

### Phase 5

- harden FHIR gateway behavior
- replace static resource claims with implemented support only
- add generic FHIR route architecture
- add Bundle and native FHIR response support for implemented resources

### Phase 6

- introduce connector architecture for external healthcare systems
- add import job tracking and source provenance
- implement one working ingestion path from an external or mock EHR source

### Phase 7

- implement payer-facing access model
- build one end-to-end payer-provider data exchange workflow
- add exchange transaction logging and consent-aware release rules

### Phase 8

- complete consent lifecycle with revoke and history
- add HIPAA-oriented security runbooks and operational evidence
- improve webhook secret handling and security observability

### Phase 9

- publish OpenAPI and FHIR support documentation
- align all docs with implemented behavior only
- add automated unit, integration, and end-to-end tests for MVP signoff

## Current Audit Reality

Current implementation status from technical audit:

- FHIR API Gateway: partial
- Patient Data Aggregation: missing
- Consent Management: partial
- HIPAA Infrastructure: partial
- Developer Documentation: partial
- Basic Analytics Dashboard: implemented
- PayerProvider Data Exchange: missing

Detailed remediation backlog:

- see `docs/mvp-remediation-roadmap.md`
- execution board: `docs/mvp-task-board.md`

## Phase Rules

- tenant isolation first
- every write produces audit logs
- new resources update docs, types, services, APIs, and UI together
- do not advertise unsupported integrations or FHIR resource support
- every new external exchange path must define auth, consent, audit, and rollback behavior
