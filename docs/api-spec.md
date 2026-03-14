# API Specification

## API Areas

- `/api/auth`
- `/api/organizations`
- `/api/patients`
- `/api/providers`
- `/api/consent`
- `/api/fhir`
- `/api/webhooks`
- `/api/analytics`
- `/api/admin`
- `/api/developer`

All endpoints return JSON. Authentication is provided by Supabase Auth sessions or developer API keys where applicable.

## Authentication

`POST /api/auth/login`
- sign in with email and password

`POST /api/auth/logout`
- end the current session

## Organizations

`GET /api/organizations`
- list organizations visible to admin context

`POST /api/organizations`
- create organization
- role: `admin`

## Patients

`GET /api/patients`
- list patients for active organization

`POST /api/patients`
- create patient
- store canonical FHIR Patient resource
- create audit log
- emit `patient.created`

`GET /api/patients/:id`
- retrieve patient profile

## Providers

`GET /api/providers`
- list providers

`POST /api/providers`
- create provider
- roles: `admin`, `provider`

## Consent

`GET /api/consent`
- list consent records

`POST /api/consent`
- create consent record
- roles: `admin`, `provider`

`GET /api/consent/:id`
- retrieve a consent record

`PUT /api/consent/:id`
- update a consent record
- roles: `admin`, `provider`

## FHIR

`GET /api/fhir`
- list implemented FHIR resource types and supported operations

Currently implemented FHIR resource types:

- `Patient`
- `Observation`
- `Encounter`
- `Consent`

`GET /api/fhir/:resourceType`
- return a FHIR `Bundle` for the implemented resource type

`POST /api/fhir/:resourceType`
- create a canonical FHIR resource for the implemented resource type
- roles: `admin`, `provider`, `developer`

`GET /api/fhir/:resourceType/:id`
- return the native FHIR resource body for the given FHIR `resource.id`

`PUT /api/fhir/:resourceType/:id`
- update the canonical FHIR resource and sync the operational record
- roles: `admin`, `provider`, `developer`

`DELETE /api/fhir/:resourceType/:id`
- delete the canonical FHIR resource and delete the operational record when safe
- roles: `admin`, `provider`, `developer`

Notes:

- FHIR collection responses are returned as native `Bundle` payloads
- single-resource reads are returned as native FHIR resource bodies
- unsupported resource types return `501 not implemented`
- patient deletion is blocked when dependent encounters, observations, or consents still reference the patient
- encounter deletion is blocked when observations still reference the encounter

## Webhooks

`GET /api/webhooks`
- list webhook subscriptions

`POST /api/webhooks`
- create subscription for events:
  - `patient.created`
  - `patient.updated`
  - `patient.deleted`
  - `fhir.resource.created`
  - `fhir.resource.updated`
  - `fhir.resource.deleted`

## Analytics

`GET /api/analytics`
- return:
  - total patients
  - total providers
  - FHIR records count
  - consent opt-in rate

## Developer

`GET /api/developer/api-keys`
- list keys

`POST /api/developer/api-keys`
- create API key and return raw token once

`GET /api/developer/usage`
- show API usage summary

## Error Shape

```json
{
  "error": {
    "code": "forbidden",
    "message": "Access denied"
  }
}
```
