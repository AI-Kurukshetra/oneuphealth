import type {
  Consent,
  DashboardMetrics,
  FhirResourceRecord,
  Organization,
  Patient,
  Provider,
  UserRole,
  WebhookSubscription,
} from "@/types/domain";

export interface ApiErrorShape {
  error: {
    code: string;
    message: string;
  };
}

export interface ListResponse<T> {
  data: T[];
}

export interface PatientInput {
  firstName: string;
  lastName: string;
  birthDate?: string;
  gender?: string;
  phone?: string;
  email?: string;
  mrn?: string;
}

export interface ProviderInput {
  firstName: string;
  lastName: string;
  specialty?: string;
  email?: string;
  phone?: string;
  npi?: string;
}

export interface ConsentInput {
  patientId: string;
  status: string;
  scope: string;
  categories: string[];
}

export interface WebhookInput {
  name: string;
  targetUrl: string;
  events: string[];
}

export interface ApiKeyCreateInput {
  name: string;
  permissions: string[];
}

export interface SessionSummary {
  userId: string;
  organizationId: string;
  role: UserRole;
}

export interface DashboardPayload {
  organization: Organization;
  metrics: DashboardMetrics;
  patients: Patient[];
  providers: Provider[];
  consents: Consent[];
  recentFhirResources: FhirResourceRecord[];
  webhooks: WebhookSubscription[];
}
