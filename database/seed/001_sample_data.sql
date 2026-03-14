-- Sample seed data for the initial schema.
-- Replace the two auth_user_id values below with UUIDs from Supabase Authentication -> Users
-- before running this script.

insert into public.organizations (
  id,
  name,
  slug,
  status,
  settings,
  created_at
)
values (
  '00000000-0000-0000-0000-000000000001',
  'Northwind Health Network',
  'northwind-health-network',
  'active',
  '{"fhirVersion":"R4","region":"US"}'::jsonb,
  '2025-01-05T00:00:00Z'
)
on conflict (id) do nothing;

insert into public.users (
  id,
  auth_user_id,
  organization_id,
  email,
  full_name,
  role,
  status,
  created_at
)
values
(
  '00000000-0000-0000-0000-000000000002',
  'a347b927-75a5-4768-945e-0da3cd97d180',
  '00000000-0000-0000-0000-000000000001',
  'admin@northwind-health.test',
  'Northwind Admin',
  'admin',
  'active',
  '2025-01-05T08:00:00Z'
),
(
  '00000000-0000-0000-0000-000000000003',
  '9f9b4ee4-dd96-45ce-a522-02f57256f01b',
  '00000000-0000-0000-0000-000000000001',
  'provider@northwind-health.test',
  'Elena Park',
  'provider',
  'active',
  '2025-01-05T08:05:00Z'
)
on conflict (id) do nothing;

insert into public.providers (
  id,
  organization_id,
  npi,
  first_name,
  last_name,
  specialty,
  email,
  phone,
  fhir_resource_id,
  created_at
)
values
(
  '20000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '1234567890',
  'Elena',
  'Park',
  'Cardiology',
  'elena.park@example.com',
  '+1-555-0200',
  null,
  '2025-01-08T09:00:00Z'
),
(
  '20000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  '1234567891',
  'Daniel',
  'Nguyen',
  'Family Medicine',
  'daniel.nguyen@example.com',
  '+1-555-0201',
  null,
  '2025-01-09T09:00:00Z'
)
on conflict (id) do nothing;

insert into public.fhir_resources (
  id,
  organization_id,
  resource_type,
  resource,
  version,
  created_at
)
values
(
  '70000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Patient',
  '{"resourceType":"Patient","id":"10000000-0000-0000-0000-000000000001","name":[{"family":"Miller","given":["Ava"]}],"gender":"female","birthDate":"1989-01-02"}'::jsonb,
  1,
  '2025-01-10T12:00:00Z'
),
(
  '70000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  'Patient',
  '{"resourceType":"Patient","id":"10000000-0000-0000-0000-000000000002","name":[{"family":"Reed","given":["Marcus"]}],"gender":"male","birthDate":"1978-07-21"}'::jsonb,
  1,
  '2025-01-12T15:30:00Z'
),
(
  '70000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000001',
  'Observation',
  '{"resourceType":"Observation","id":"obs-1","status":"final","code":{"text":"Systolic blood pressure"},"subject":{"reference":"Patient/10000000-0000-0000-0000-000000000002"},"valueQuantity":{"value":122,"unit":"mmHg"}}'::jsonb,
  1,
  '2025-01-12T16:30:00Z'
),
(
  '70000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000001',
  'Consent',
  '{"resourceType":"Consent","id":"30000000-0000-0000-0000-000000000001","status":"active","patient":{"reference":"Patient/10000000-0000-0000-0000-000000000001"}}'::jsonb,
  1,
  '2025-01-10T12:05:00Z'
)
on conflict (id) do nothing;

insert into public.patients (
  id,
  organization_id,
  external_id,
  mrn,
  first_name,
  last_name,
  birth_date,
  gender,
  phone,
  email,
  address,
  fhir_resource_id,
  created_by,
  created_at
)
values
(
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'EXT-1001',
  'MRN-1001',
  'Ava',
  'Miller',
  '1989-01-02',
  'female',
  '+1-555-0100',
  'ava.miller@example.com',
  '{"line1":"200 Main St","city":"Boston","state":"MA"}'::jsonb,
  '70000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '2025-01-10T12:00:00Z'
),
(
  '10000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  'EXT-1002',
  'MRN-1002',
  'Marcus',
  'Reed',
  '1978-07-21',
  'male',
  '+1-555-0101',
  'marcus.reed@example.com',
  '{"line1":"20 Cedar Ave","city":"Providence","state":"RI"}'::jsonb,
  '70000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000002',
  '2025-01-12T15:30:00Z'
)
on conflict (id) do nothing;

insert into public.encounters (
  id,
  organization_id,
  patient_id,
  provider_id,
  status,
  class_code,
  start_at,
  end_at,
  reason,
  fhir_resource_id,
  created_at
)
values (
  '40000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000002',
  '20000000-0000-0000-0000-000000000002',
  'finished',
  'AMB',
  '2025-01-12T16:00:00Z',
  '2025-01-12T16:20:00Z',
  'Routine blood pressure check',
  null,
  '2025-01-12T16:20:00Z'
)
on conflict (id) do nothing;

insert into public.observations (
  id,
  organization_id,
  patient_id,
  encounter_id,
  code,
  display,
  status,
  value,
  effective_at,
  fhir_resource_id,
  created_at
)
values (
  '50000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000002',
  '40000000-0000-0000-0000-000000000001',
  '8480-6',
  'Systolic blood pressure',
  'final',
  '{"value":122,"unit":"mmHg"}'::jsonb,
  '2025-01-12T16:15:00Z',
  '70000000-0000-0000-0000-000000000003',
  '2025-01-12T16:30:00Z'
)
on conflict (id) do nothing;

insert into public.consents (
  id,
  organization_id,
  patient_id,
  status,
  scope,
  categories,
  effective_from,
  effective_to,
  source,
  fhir_resource_id,
  created_by,
  created_at
)
values (
  '30000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  'active',
  'data-sharing',
  array['treatment', 'payment'],
  '2025-01-10T00:00:00Z',
  null,
  'portal',
  '70000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000002',
  '2025-01-10T12:05:00Z'
)
on conflict (id) do nothing;

insert into public.audit_logs (
  id,
  organization_id,
  user_id,
  action,
  resource_type,
  resource_id,
  metadata,
  timestamp,
  created_at
)
values
(
  '60000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  'patient.created',
  'patients',
  '10000000-0000-0000-0000-000000000001',
  '{"source":"seed"}'::jsonb,
  '2025-01-10T12:00:00Z',
  '2025-01-10T12:00:00Z'
),
(
  '60000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  'consent.created',
  'consents',
  '30000000-0000-0000-0000-000000000001',
  '{"source":"seed"}'::jsonb,
  '2025-01-10T12:05:00Z',
  '2025-01-10T12:05:00Z'
)
on conflict (id) do nothing;

insert into public.webhooks (
  id,
  organization_id,
  name,
  target_url,
  events,
  secret_hash,
  status,
  last_triggered_at,
  created_at
)
values (
  '80000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Population Health App',
  'https://example.com/hooks/interop',
  array['patient.created', 'fhir.resource.created'],
  null,
  'active',
  '2025-01-13T11:00:00Z',
  '2025-01-10T09:00:00Z'
)
on conflict (id) do nothing;

insert into public.api_keys (
  id,
  organization_id,
  user_id,
  name,
  key_prefix,
  key_hash,
  permissions,
  last_used_at,
  revoked_at,
  created_at
)
values (
  '90000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  'Sandbox Integration',
  'hp_live',
  'hashed-demo-key',
  array['fhir.read', 'fhir.write', 'webhooks.read'],
  '2025-01-14T10:00:00Z',
  null,
  '2025-01-11T10:00:00Z'
)
on conflict (id) do nothing;
