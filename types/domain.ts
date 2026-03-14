export type UserRole = "admin" | "provider" | "payer" | "developer";

export type FhirResourceType =
  | "Patient"
  | "Observation"
  | "Encounter"
  | "Condition"
  | "Medication"
  | "Procedure"
  | "Claim"
  | "Consent";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  status: "active" | "inactive";
  settings?: Record<string, unknown>;
  created_at: string;
}

export interface AppUser {
  id: string;
  auth_user_id: string;
  organization_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  status: "active" | "invited" | "disabled";
  created_at: string;
}

export interface Patient {
  id: string;
  organization_id: string;
  external_id?: string | null;
  mrn?: string | null;
  first_name: string;
  last_name: string;
  birth_date?: string | null;
  gender?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: Record<string, unknown> | null;
  fhir_resource_id?: string | null;
  created_by?: string | null;
  created_at: string;
}

export interface Provider {
  id: string;
  organization_id: string;
  npi?: string | null;
  first_name: string;
  last_name: string;
  specialty?: string | null;
  email?: string | null;
  phone?: string | null;
  fhir_resource_id?: string | null;
  created_at: string;
}

export interface Encounter {
  id: string;
  organization_id: string;
  patient_id: string;
  provider_id?: string | null;
  status: string;
  class_code?: string | null;
  start_at?: string | null;
  end_at?: string | null;
  reason?: string | null;
  fhir_resource_id?: string | null;
  created_at: string;
}

export interface Observation {
  id: string;
  organization_id: string;
  patient_id: string;
  encounter_id?: string | null;
  code: string;
  display?: string | null;
  status: string;
  value?: Record<string, unknown> | null;
  effective_at?: string | null;
  fhir_resource_id?: string | null;
  created_at: string;
}

export interface Consent {
  id: string;
  organization_id: string;
  patient_id: string;
  status: string;
  scope: string;
  categories: string[];
  effective_from?: string | null;
  effective_to?: string | null;
  source?: string | null;
  fhir_resource_id?: string | null;
  created_by?: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  organization_id: string;
  user_id?: string | null;
  action: string;
  resource_type: string;
  resource_id: string;
  metadata?: Record<string, unknown> | null;
  timestamp: string;
  created_at: string;
}

export interface FhirResourceRecord {
  id: string;
  organization_id: string;
  resource_type: FhirResourceType;
  resource: Record<string, unknown>;
  version: number;
  created_at: string;
}

export interface WebhookSubscription {
  id: string;
  organization_id: string;
  name: string;
  target_url: string;
  events: string[];
  secret_hash?: string | null;
  status: "active" | "paused" | "disabled";
  last_triggered_at?: string | null;
  created_at: string;
}

export interface ApiKey {
  id: string;
  organization_id: string;
  user_id: string;
  name: string;
  key_prefix: string;
  key_hash: string;
  permissions: string[];
  last_used_at?: string | null;
  revoked_at?: string | null;
  created_at: string;
}

export interface DashboardMetrics {
  totalPatients: number;
  totalProviders: number;
  fhirRecordsCount: number;
  consentOptInRate: number;
}

export interface RequestContext {
  organizationId: string;
  userId: string;
  role: UserRole;
}
