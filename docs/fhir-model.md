# FHIR R4 Model

## Supported Resource Types

- Patient
- Observation
- Encounter
- Condition
- Medication
- Procedure
- Claim
- Consent

## Canonical Storage

Canonical resources are stored in `fhir_resources` with:

- `id`
- `organization_id`
- `resource_type`
- `resource`
- `version`
- `created_at`

`resource` is the full JSON payload. The application preserves canonical FHIR content while optionally extracting operational fields into relational tables.

## Resource Mapping

Patient:

- map `name`, `gender`, `birthDate`, `telecom`, and `address` into `patients`

Observation:

- map `status`, `code`, `subject`, `encounter`, `effectiveDateTime`, and `value[x]` into `observations`

Encounter:

- map `status`, `class`, `subject`, `participant`, and `period` into `encounters`

Consent:

- map `status`, `scope`, `category`, and `patient` into `consents`

## Validation Rules

- `resourceType` must exist and be supported
- subject references must belong to the same organization
- canonical JSON is stored after validation
- operational extraction is best-effort for supported resource types

## Engine Responsibilities

The FHIR engine should:

- validate payload shape
- normalize application forms into FHIR resources
- extract operational fields
- retrieve canonical resources by type and id
- preserve version metadata
