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
- create or update patient consent
- roles: `admin`, `provider`

## FHIR

`GET /api/fhir/Patient/:id`
- return canonical FHIR Patient resource

`POST /api/fhir/Patient`
- create FHIR Patient resource

`GET /api/fhir/Observation`
- list Observation resources

`POST /api/fhir/Observation`
- create Observation resource

`GET /api/fhir/Encounter`
- list Encounter resources

`POST /api/fhir/Encounter`
- create Encounter resource

## Webhooks

`GET /api/webhooks`
- list webhook subscriptions

`POST /api/webhooks`
- create subscription for events:
  - `patient.created`
  - `patient.updated`
  - `patient.deleted`
  - `fhir.resource.created`

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
