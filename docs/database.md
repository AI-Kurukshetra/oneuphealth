# Database Design

## Overview

Supabase PostgreSQL stores tenant, operational, FHIR, audit, webhook, and developer-access data. Every tenant-owned table includes `organization_id`, uses UUID primary keys, and is protected by Row Level Security.

## Required Tables

- `organizations`
- `users`
- `patients`
- `providers`
- `encounters`
- `observations`
- `consents`
- `audit_logs`
- `fhir_resources`
- `webhooks`
- `api_keys`

## Key Modeling Rules

- use `uuid` primary keys
- use `created_at timestamptz default now()`
- index `organization_id` on every tenant table
- add foreign keys for all parent-child relationships
- use JSONB for flexible fields and full FHIR payloads

## Table Intent

`organizations`
- tenant root record with name, slug, status, settings

`users`
- application profile linked to Supabase Auth user, role, and organization

`patients`
- operational patient summary mapped from FHIR Patient

`providers`
- provider records including NPI and specialty

`encounters`
- visit-level summaries linked to patients and providers

`observations`
- clinical measurements and lab observations

`consents`
- patient sharing consent state and category scope

`audit_logs`
- append-only write trail with actor and resource metadata

`fhir_resources`
- canonical FHIR R4 JSON storage with version tracking

`webhooks`
- outbound subscription endpoints and event configuration

`api_keys`
- hashed developer keys and permission scopes

## FHIR Storage Model

`fhir_resources` columns:

- `id`
- `organization_id`
- `resource_type`
- `resource jsonb`
- `version`
- `created_at`

Supported types:

- Patient
- Observation
- Encounter
- Condition
- Medication
- Procedure
- Claim
- Consent

## Index Strategy

- `organization_id` on all tenant tables
- patient search index on `(organization_id, last_name, first_name)`
- provider lookup index on `(organization_id, npi)`
- encounter index on `(organization_id, patient_id)`
- observation index on `(organization_id, patient_id, effective_at desc)`
- consent index on `(organization_id, patient_id, status)`
- FHIR index on `(organization_id, resource_type, created_at desc)`
- audit index on `(organization_id, timestamp desc)`

## RLS Model

Users can only read and write rows where `organization_id` matches their organization membership. Policies use helper functions to resolve the current application user and tenant.

RLS requirements:

- authenticated users only
- same-organization access only
- optional role-aware insert and update checks where needed

## Additional Scope

The broader domain also includes `conditions`, `medications`, `procedures`, and `claims`. The initial scaffold supports these in the FHIR engine and shared types, while the first migration focuses on the required tables listed above.
