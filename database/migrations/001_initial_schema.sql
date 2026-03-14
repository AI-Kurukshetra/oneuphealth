create extension if not exists "pgcrypto";

create schema if not exists app;

create or replace function app.current_auth_user_id()
returns uuid
language sql
stable
as $$
  select auth.uid();
$$;

create type public.user_role as enum ('admin', 'provider', 'payer', 'developer');

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  status text not null default 'active',
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  email text not null,
  full_name text not null,
  role public.user_role not null default 'provider',
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.fhir_resources (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  resource_type text not null,
  resource jsonb not null,
  version integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  external_id text,
  mrn text,
  first_name text not null,
  last_name text not null,
  birth_date date,
  gender text,
  phone text,
  email text,
  address jsonb,
  fhir_resource_id uuid references public.fhir_resources(id) on delete set null,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.providers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  npi text,
  first_name text not null,
  last_name text not null,
  specialty text,
  email text,
  phone text,
  fhir_resource_id uuid references public.fhir_resources(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.encounters (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  patient_id uuid not null references public.patients(id) on delete cascade,
  provider_id uuid references public.providers(id) on delete set null,
  status text not null,
  class_code text,
  start_at timestamptz,
  end_at timestamptz,
  reason text,
  fhir_resource_id uuid references public.fhir_resources(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.observations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  patient_id uuid not null references public.patients(id) on delete cascade,
  encounter_id uuid references public.encounters(id) on delete set null,
  code text not null,
  display text,
  status text not null,
  value jsonb,
  effective_at timestamptz,
  fhir_resource_id uuid references public.fhir_resources(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.consents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  patient_id uuid not null references public.patients(id) on delete cascade,
  status text not null,
  scope text not null,
  categories text[] not null default '{}',
  effective_from timestamptz,
  effective_to timestamptz,
  source text,
  fhir_resource_id uuid references public.fhir_resources(id) on delete set null,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid references public.users(id) on delete set null,
  action text not null,
  resource_type text not null,
  resource_id uuid not null,
  metadata jsonb,
  timestamp timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.webhooks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  target_url text not null,
  events text[] not null default '{}',
  secret_hash text,
  status text not null default 'active',
  last_triggered_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.api_keys (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  key_prefix text not null,
  key_hash text not null,
  permissions text[] not null default '{}',
  last_used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_users_org on public.users (organization_id);
create index if not exists idx_patients_org on public.patients (organization_id);
create index if not exists idx_patients_search on public.patients (organization_id, last_name, first_name);
create index if not exists idx_providers_org on public.providers (organization_id);
create index if not exists idx_providers_npi on public.providers (organization_id, npi);
create index if not exists idx_encounters_org_patient on public.encounters (organization_id, patient_id);
create index if not exists idx_observations_org_patient on public.observations (organization_id, patient_id, effective_at desc);
create index if not exists idx_consents_org_patient on public.consents (organization_id, patient_id, status);
create index if not exists idx_audit_logs_org_timestamp on public.audit_logs (organization_id, timestamp desc);
create index if not exists idx_fhir_resources_org_type on public.fhir_resources (organization_id, resource_type, created_at desc);
create index if not exists idx_webhooks_org on public.webhooks (organization_id);
create index if not exists idx_api_keys_org_user on public.api_keys (organization_id, user_id);
