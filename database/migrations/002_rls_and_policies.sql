create or replace function app.current_organization_id()
returns uuid
language sql
stable
as $$
  select organization_id
  from public.users
  where auth_user_id = auth.uid()
  limit 1;
$$;

alter table public.users enable row level security;
alter table public.patients enable row level security;
alter table public.providers enable row level security;
alter table public.encounters enable row level security;
alter table public.observations enable row level security;
alter table public.consents enable row level security;
alter table public.audit_logs enable row level security;
alter table public.fhir_resources enable row level security;
alter table public.webhooks enable row level security;
alter table public.api_keys enable row level security;

create policy "users same organization select" on public.users
for select using (organization_id = app.current_organization_id());
create policy "users same organization insert" on public.users
for insert with check (organization_id = app.current_organization_id());
create policy "users same organization update" on public.users
for update using (organization_id = app.current_organization_id()) with check (organization_id = app.current_organization_id());

create policy "patients same organization all" on public.patients
for all using (organization_id = app.current_organization_id()) with check (organization_id = app.current_organization_id());
create policy "providers same organization all" on public.providers
for all using (organization_id = app.current_organization_id()) with check (organization_id = app.current_organization_id());
create policy "encounters same organization all" on public.encounters
for all using (organization_id = app.current_organization_id()) with check (organization_id = app.current_organization_id());
create policy "observations same organization all" on public.observations
for all using (organization_id = app.current_organization_id()) with check (organization_id = app.current_organization_id());
create policy "consents same organization all" on public.consents
for all using (organization_id = app.current_organization_id()) with check (organization_id = app.current_organization_id());
create policy "audit_logs same organization select" on public.audit_logs
for select using (organization_id = app.current_organization_id());
create policy "audit_logs same organization insert" on public.audit_logs
for insert with check (organization_id = app.current_organization_id());
create policy "fhir_resources same organization all" on public.fhir_resources
for all using (organization_id = app.current_organization_id()) with check (organization_id = app.current_organization_id());
create policy "webhooks same organization all" on public.webhooks
for all using (organization_id = app.current_organization_id()) with check (organization_id = app.current_organization_id());
create policy "api_keys same organization all" on public.api_keys
for all using (organization_id = app.current_organization_id()) with check (organization_id = app.current_organization_id());
