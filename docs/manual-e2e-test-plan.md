# Manual End-to-End Test Plan

## Purpose

This document is the practical test guide for the current application state.

It is not a unit-test specification for automated test runners like Jest or Vitest.
It is a manual QA and end-to-end validation checklist for verifying what has been built so far.

Use this document when you want to answer these questions:

- what functionality exists today
- what is only scaffolded or partial
- what exact user flows should be tested manually
- what API and database checks confirm the system is working correctly

## Current Product Scope

The application is a multi-tenant healthcare interoperability platform built on Next.js and Supabase.

### Functional Areas Implemented

- Supabase Auth login and logout
- tenant-aware server-side request context
- dashboard with organization metrics and recent operational data
- patient listing, creation, and patient detail view
- provider listing and creation
- consent listing and creation
- developer API key listing and creation
- analytics view
- organization details view
- admin API for organization summary and user listing
- FHIR API support for Patient, Observation, and Encounter creation and listing/retrieval
- audit logging for write actions
- webhook subscription registration and webhook event delivery attempts
- FHIR resource storage plus operational extraction for Patient, Observation, Encounter, and Consent

### Functionality That Exists But Is Partial

- analytics usage numbers are mock/demo-style summary values, not real traffic analytics
- developer page shows endpoint tester examples but is not a full API console
- webhook management UI is read-only; creation is currently API-driven
- organization management UI is read-only; create organization exists through API
- admin APIs exist, but there is no full admin UI for user management
- no edit/update/delete flows for patients, providers, consents, webhooks, API keys, or organizations
- no self-service user registration in the UI
- no password reset flow in the UI
- no claims, procedures, medications, or conditions UI flows

### Important Reality Check

There is no in-app "create user" screen.
User creation currently happens through Supabase Auth plus the bootstrap/seed flow.
So your manual testing should start from seeded or pre-created users, not from a signup page.

## Test Environments

You can run this plan in either of these environments:

1. Local app with local `.env.local`
2. Deployed app on Vercel with Supabase project configured

Recommended for first-pass testing:

- test on deployed app for production-like behavior
- verify database state directly in Supabase SQL Editor
- use browser dev tools and Postman or curl for API checks

## Preconditions

Before manual testing, confirm all of the following:

- Supabase project exists
- the database schema was applied
- sample seed data was inserted
- the two test users exist in Supabase Auth
- Vercel environment variables are configured if testing deployed app

### Required Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Seeded Users

These are the expected seeded login accounts.

- Admin user
  - email: `admin@northwind-health.test`
  - password: `Admin123!@#`
- Provider user
  - email: `provider@northwind-health.test`
  - password: `Provider123!@#`

Important:
If these users already existed before the bootstrap script ran, the passwords may not have been reset.

## Basic Architecture Explanation

The application works in these layers:

- `app/`: pages and route handlers
- `services/`: business rules and role enforcement
- `repositories/`: database access through Supabase
- `lib/auth`: request context and auth/session logic
- `lib/fhir`: FHIR normalization and extraction logic

### Request Context Model

Protected pages and APIs derive the current context from one of these sources:

- Supabase session cookie
- API key in `Authorization: Bearer <token>`
- internal headers only for trusted/internal scenarios

That context determines:

- `organizationId`
- `userId`
- `role`

### Roles Used in the App

- `admin`
- `provider`
- `developer`
- `payer` exists in types but is not actively exercised in current UI flows

## High-Level Functional Checklist

Use this as the master checklist.

- public landing page loads
- login works with seeded users
- authenticated header shows `Signed in` and `Logout`
- dashboard loads organization metrics and cards
- patient list loads
- patient creation works
- patient detail page loads
- provider list loads
- provider creation works
- consent list loads
- consent creation works
- analytics page loads
- developer page loads
- API key creation works
- organization page loads
- FHIR Patient POST works
- FHIR Observation GET and POST work
- FHIR Encounter GET and POST work
- admin summary API works for admin
- admin users API works for admin
- webhook registration API works
- audit records are written for mutations
- webhook `last_triggered_at` updates when delivery is attempted
- role restrictions behave correctly

## Manual Test Flow Order

Recommended test order:

1. Public access and login
2. Dashboard and navigation
3. Patient flow
4. Provider flow
5. Consent flow
6. Developer/API key flow
7. FHIR API flow
8. Admin API flow
9. Role-restriction checks
10. Database verification

## Flow 1: Public Access and Login

### Goal

Verify public pages are accessible and protected pages require authentication.

### Steps

1. Open `/`
2. Confirm landing page renders without login
3. Click `Launch Platform` or `Sign In`
4. Open `/login`
5. Sign in with admin user
6. Confirm redirect or navigation to protected app area
7. Confirm top navigation shows authenticated state
8. Click `Logout`
9. Confirm you return to `/login`

### Expected Result

- public home page is visible without error
- login form accepts seeded credentials
- authenticated pages no longer redirect to `/login`
- logout clears session and blocks protected pages again

### Negative Checks

- invalid password should fail login
- opening protected routes while logged out should redirect to `/login`

## Flow 2: Dashboard

### Goal

Verify the dashboard renders tenant-specific data.

### Route

- `/dashboard`

### What This Page Is Supposed To Show

- organization name
- patient/provider/FHIR metrics
- webhook summary
- recent patients
- API key summary

### Steps

1. Login as admin
2. Open `/dashboard`
3. Confirm organization title displays
4. Confirm metrics cards render
5. Confirm webhook list renders
6. Confirm recent patients render
7. Confirm API key section renders

### Expected Result

- no server error
- values are non-empty if seed data exists
- page reflects the seeded organization

## Flow 3: Patient Flow

### Goal

Verify patient creation and retrieval across UI, FHIR storage, and database state.

### Routes

- `/patients`
- `/patients/create`
- `/patients/:id`
- `GET /api/patients`
- `POST /api/patients`
- `GET /api/patients/:id`

### Functional Explanation

When a patient is created through UI or API:

- a patient input payload is validated
- a canonical FHIR Patient resource is created and stored
- an operational row is written to `public.patients`
- an audit log entry is created
- matching webhooks are attempted

### UI Test Steps

1. Open `/patients`
2. Confirm existing seed patients display
3. Click `Create Patient`
4. Enter a new patient
5. Submit form
6. Confirm redirect back to `/patients`
7. Confirm new patient appears in the list
8. Open the patient detail page
9. Confirm demographics and consent/FHIR summary render

### Suggested Test Data

- firstName: `Riya`
- lastName: `Shah`
- birthDate: `1993-08-12`
- gender: `female`
- mrn: `MRN-9001`
- phone: `+1-555-3030`
- email: `riya.shah@example.com`

### API Test Steps

`POST /api/patients`

```json
{
  "firstName": "Riya",
  "lastName": "Shah",
  "birthDate": "1993-08-12",
  "gender": "female",
  "mrn": "MRN-9001",
  "phone": "+1-555-3030",
  "email": "riya.shah@example.com"
}
```

### Expected Result

- patient appears in `public.patients`
- matching FHIR Patient resource exists in `public.fhir_resources`
- audit log entry exists with action `patient.created`
- if webhook subscriptions match `patient.created`, delivery is attempted

### Negative Checks

- missing `firstName` should fail
- missing `lastName` should fail
- invalid email should fail
- provider role should be able to create
- unauthorized user should not be able to create

## Flow 4: Provider Flow

### Goal

Verify provider listing and creation.

### Routes

- `/providers`
- `GET /api/providers`
- `POST /api/providers`

### Functional Explanation

When a provider is created:

- provider input is validated
- row is written to `public.providers`
- audit log entry is created
- matching webhooks are attempted

### UI Test Steps

1. Open `/providers`
2. Confirm seeded providers display
3. Add a new provider using the form
4. Confirm it appears in the provider list after submit

### Suggested Test Data

- firstName: `Arjun`
- lastName: `Mehta`
- specialty: `Orthopedics`
- npi: `1234567801`
- phone: `+1-555-4040`
- email: `arjun.mehta@example.com`

### Expected Result

- provider appears in `public.providers`
- audit log action `provider.created` exists
- matching webhook delivery is attempted

### Negative Checks

- missing first or last name should fail
- invalid email should fail
- admin and provider should be allowed

## Flow 5: Consent Flow

### Goal

Verify consent creation and storage across relational and FHIR layers.

### Routes

- `/consent`
- `GET /api/consent`
- `POST /api/consent`

### Functional Explanation

When a consent is created:

- input is validated
- canonical FHIR Consent resource is stored
- operational row is written to `public.consents`
- audit log entry is created
- matching webhooks are attempted

### UI Test Steps

1. Open `/consent`
2. Confirm active consents list renders
3. Use a real patient UUID from `public.patients`
4. Create a new consent
5. Confirm it appears in the list

### Suggested Test Data

- patientId: use an actual patient UUID
- status: `active`
- scope: `data-sharing`
- categories: `treatment,payment`

### Expected Result

- consent row exists in `public.consents`
- FHIR Consent resource exists in `public.fhir_resources`
- audit log action `consent.created` exists

### Negative Checks

- invalid patient UUID should fail
- non-existent patient UUID should fail
- empty categories should fail

## Flow 6: Analytics Flow

### Goal

Verify metrics pages load and show coherent counts.

### Routes

- `/analytics`
- `GET /api/analytics`

### Functional Explanation

Analytics currently aggregate counts from the repository layer:

- total patients
- total providers
- FHIR resource count
- consent opt-in rate

### Steps

1. Open `/analytics`
2. Note the baseline metrics
3. Create one patient, one provider, and one consent
4. Return to `/analytics`
5. Confirm counts increased logically

### Expected Result

- metrics cards render
- graphs render
- values change after new data is created

## Flow 7: Developer Flow and API Keys

### Goal

Verify API key management and developer usage views.

### Routes

- `/developer`
- `GET /api/developer`
- `GET /api/developer/api-keys`
- `POST /api/developer/api-keys`
- `GET /api/developer/usage`

### Functional Explanation

When an API key is created:

- input is validated
- a raw token is generated once
- a hash is stored in `public.api_keys`
- audit log entry is created
- matching webhooks are attempted

### UI Test Steps

1. Login as admin
2. Open `/developer`
3. Confirm existing API key cards render
4. Create a new API key using comma-separated permissions
5. Confirm page reloads and new key prefix appears
6. Confirm usage summary panel renders

### Suggested Test Data

- name: `QA Integration`
- permissions: `fhir.read,fhir.write,webhooks.read`

### Expected Result

- new key row exists in `public.api_keys`
- UI shows only the stored key prefix, not the full token
- audit log action `api_key.created` exists

### Important Note

The UI does not display the returned raw token after submission.
If you want to verify the exact raw token returned once, use the API route directly in Postman or browser dev tools.

## Flow 8: Organization and Admin Views

### Goal

Verify admin-only data access.

### Routes

- `/organizations`
- `GET /api/admin`
- `GET /api/admin/users`
- `GET /api/organizations`
- `POST /api/organizations`

### Functional Explanation

- organization page shows current tenant details
- admin summary API returns organization and capability data
- admin users API lists application users for the tenant
- organization creation currently exists only via API

### Manual Steps

1. Login as admin
2. Open `/organizations`
3. Confirm organization details render
4. Call `GET /api/admin`
5. Call `GET /api/admin/users`
6. Call `GET /api/organizations`
7. Call `POST /api/organizations` with admin user if you want to validate creation path

### Organization Create Payload

```json
{
  "name": "QA Test Health Network"
}
```

### Expected Result

- admin routes should work for admin
- admin routes should reject unauthorized roles
- organization creation should return a new UUID and slug

## Flow 9: FHIR API Flow

### Goal

Verify canonical FHIR creation and operational extraction.

### Routes

- `GET /api/fhir`
- `GET /api/fhir/Patient/:id`
- `POST /api/fhir/Patient`
- `GET /api/fhir/Observation`
- `POST /api/fhir/Observation`
- `GET /api/fhir/Encounter`
- `POST /api/fhir/Encounter`

### Functional Explanation

These endpoints store canonical FHIR JSON and, for supported resource types, also create operational rows.

Current extraction support:

- Patient -> `public.patients`
- Observation -> `public.observations`
- Encounter -> `public.encounters`
- Consent -> extraction exists internally through service flow

### Test 9A: FHIR Patient Create

```json
{
  "resourceType": "Patient",
  "id": "11111111-1111-1111-1111-111111111111",
  "identifier": [{ "system": "urn:mrn", "value": "MRN-FHIR-1" }],
  "name": [{ "family": "Fernandes", "given": ["Aisha"] }],
  "gender": "female",
  "birthDate": "1991-05-09",
  "telecom": [
    { "system": "email", "value": "aisha.fernandes@example.com" },
    { "system": "phone", "value": "+1-555-5050" }
  ]
}
```

Expected:

- FHIR row stored in `public.fhir_resources`
- patient row stored in `public.patients`
- audit log action `fhir.resource.created`

### Test 9B: FHIR Encounter Create

Use an existing patient UUID and provider UUID.

```json
{
  "resourceType": "Encounter",
  "id": "22222222-2222-2222-2222-222222222222",
  "status": "finished",
  "class": { "code": "AMB" },
  "subject": { "reference": "Patient/<PATIENT_UUID>" },
  "participant": [
    { "individual": { "reference": "Practitioner/<PROVIDER_UUID>" } }
  ],
  "period": {
    "start": "2025-01-20T10:00:00Z",
    "end": "2025-01-20T10:20:00Z"
  },
  "reasonCode": [
    { "text": "Follow-up consultation" }
  ]
}
```

Expected:

- FHIR row stored
- encounter row stored in `public.encounters`
- invalid patient/provider references should fail

### Test 9C: FHIR Observation Create

Use an existing patient UUID and optionally an encounter UUID.

```json
{
  "resourceType": "Observation",
  "id": "33333333-3333-3333-3333-333333333333",
  "status": "final",
  "code": {
    "coding": [{ "system": "http://loinc.org", "code": "8480-6", "display": "Systolic blood pressure" }],
    "text": "Systolic blood pressure"
  },
  "subject": { "reference": "Patient/<PATIENT_UUID>" },
  "encounter": { "reference": "Encounter/<ENCOUNTER_UUID>" },
  "effectiveDateTime": "2025-01-20T10:10:00Z",
  "valueQuantity": { "value": 121, "unit": "mmHg" }
}
```

Expected:

- FHIR row stored
- observation row stored in `public.observations`
- invalid patient reference should fail
- invalid encounter reference should fail

## Flow 10: Webhook Registration and Delivery

### Goal

Verify webhook creation and delivery attempts.

### Routes

- `GET /api/webhooks`
- `POST /api/webhooks`

### Functional Explanation

Webhook subscriptions are stored in `public.webhooks`.
When matching events occur, the app attempts an HTTP POST to the target URL and updates `last_triggered_at`.

### Important Note

There is currently no UI form to create webhooks.
Use API testing tools for this flow.

### Registration Payload

```json
{
  "name": "QA Webhook",
  "targetUrl": "https://webhook.site/your-test-id",
  "events": ["patient.created", "fhir.resource.created"]
}
```

### Steps

1. Register a webhook using `POST /api/webhooks`
2. Create a patient or FHIR resource
3. Confirm the target endpoint received a POST
4. Query `public.webhooks` and verify `last_triggered_at` was updated

### Expected Result

- webhook row exists
- matching event produces delivery attempt
- `last_triggered_at` changes on successful request attempt

## Role-Based Access Tests

### Admin User Should Be Able To

- view dashboard
- create patients
- create providers
- create consents
- create API keys
- view developer usage
- call admin APIs
- create webhooks
- create organizations through API
- create FHIR Patient, Observation, Encounter

### Provider User Should Be Able To

- login
- view dashboard
- create patients
- create providers
- create consents
- create FHIR Patient, Observation, Encounter

### Provider User Should Not Be Able To

- call admin-only APIs
- create API keys
- create organizations
- create webhooks

### Manual Role Test Steps

1. Login as provider user
2. open `/developer`
3. confirm access is blocked or fails appropriately
4. call `GET /api/admin`
5. confirm 403
6. call `POST /api/webhooks`
7. confirm 403
8. confirm patient/provider/consent creation still works

## Database Verification Queries

Use these in Supabase SQL Editor after running the manual tests.

### Auth Users

```sql
select id, email
from auth.users
order by created_at desc;
```

### Application Users

```sql
select id, auth_user_id, organization_id, email, role, status
from public.users
order by created_at desc;
```

### Organizations

```sql
select id, name, slug, status
from public.organizations
order by created_at desc;
```

### Patients

```sql
select id, organization_id, first_name, last_name, mrn, fhir_resource_id, created_at
from public.patients
order by created_at desc;
```

### Providers

```sql
select id, organization_id, first_name, last_name, npi, created_at
from public.providers
order by created_at desc;
```

### Consents

```sql
select id, organization_id, patient_id, status, scope, categories, fhir_resource_id, created_at
from public.consents
order by created_at desc;
```

### Encounters

```sql
select id, organization_id, patient_id, provider_id, status, class_code, fhir_resource_id, created_at
from public.encounters
order by created_at desc;
```

### Observations

```sql
select id, organization_id, patient_id, encounter_id, code, status, fhir_resource_id, created_at
from public.observations
order by created_at desc;
```

### FHIR Resources

```sql
select id, organization_id, resource_type, version, created_at
from public.fhir_resources
order by created_at desc;
```

### Audit Logs

```sql
select id, organization_id, user_id, action, resource_type, resource_id, timestamp
from public.audit_logs
order by timestamp desc;
```

### Webhooks

```sql
select id, organization_id, name, target_url, events, status, last_triggered_at, created_at
from public.webhooks
order by created_at desc;
```

### API Keys

```sql
select id, organization_id, user_id, name, key_prefix, permissions, revoked_at, created_at
from public.api_keys
order by created_at desc;
```

## API Testing Tips

### Browser Session-Based Testing

For routes that use the web app session, test directly in the browser after logging in.

### API Key Testing

For machine-style testing, use:

```http
Authorization: Bearer <raw_api_key>
```

Important:
The raw API key is returned only once at creation time through the API response.
If you create it only from the current UI, that raw token is not shown back to you.

## Known Gaps To Keep In Mind During Testing

Do not treat these as bugs unless you want to build them next:

- no user signup page
- no user invite flow
- no user edit/delete flow
- no patient edit/delete flow
- no provider edit/delete flow
- no consent update/revoke flow in UI
- no webhook create form in UI
- no API key revoke flow
- no real usage analytics backend
- no claims/procedures/medications/conditions end-user workflows

## Final Sign-Off Checklist

Mark the build acceptable only if all of the following are true:

- seeded users can log in
- logout works
- admin can access all protected pages
- provider is blocked from admin/developer-only functions
- patient creation works from UI and API
- provider creation works from UI and API
- consent creation works from UI and API
- developer API key creation works for admin
- analytics page loads without error
- organization page loads without error
- FHIR Patient creation stores both canonical and operational data
- FHIR Encounter creation stores both canonical and operational data
- FHIR Observation creation stores both canonical and operational data
- audit logs are written for write operations
- webhook rows update `last_triggered_at` when delivery is attempted
- no protected page throws a server error during normal seeded-user usage

## Suggested Next Step After Manual Testing

After this manual pass, the next engineering step should be automated coverage:

- unit tests for service-layer validation and role enforcement
- integration tests for API routes
- seeded end-to-end browser tests for login and core CRUD flows
