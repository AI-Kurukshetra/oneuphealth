# Codex Rules

## Mandatory Repository Rules

1. Update documentation with architecture-impacting changes.
2. Keep business logic in `services/`.
3. Keep Supabase access in `repositories/`.
4. Preserve `organization_id` on every tenant-owned record.
5. Store canonical FHIR payloads in `fhir_resources`.
6. Add audit logging to every create, update, and delete flow.
7. Store only hashed API keys after creation.
8. Prefer server components unless interactivity requires a client component.
9. Update shared types before changing contracts.
10. Keep APIs and docs aligned.

## Definition of Done

A feature is not complete until:

- docs are updated
- types are updated
- database impact is migrated
- audit logging is included
- tenant isolation remains intact
