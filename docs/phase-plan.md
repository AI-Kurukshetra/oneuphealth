# Delivery Phase Plan

## Phase 1

- scaffold project structure
- create architecture and implementation docs
- add initial database migration and RLS

## Phase 2

- implement repositories and services
- implement audit logging and webhook dispatch
- add FHIR resource engine

## Phase 3

- build REST and FHIR APIs
- add server actions for UI workflows
- add validation and role guards

## Phase 4

- build dashboard, patient, provider, consent, analytics, and developer pages
- add reusable tables, forms, and charts

## Phase 5

- harden security and testing
- expand integrations, claims workflows, and advanced analytics

## Phase Rules

- tenant isolation first
- every write produces audit logs
- new resources update docs, types, services, APIs, and UI together
