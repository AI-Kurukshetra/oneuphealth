import type {
  ApiKey,
  AppUser,
  Consent,
  DashboardMetrics,
  Encounter,
  FhirResourceRecord,
  Observation,
  Organization,
  Patient,
  Provider,
  WebhookSubscription,
} from "@/types/domain";

export const mockOrganization: Organization = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "Northwind Health Network",
  slug: "northwind-health-network",
  status: "active",
  settings: { fhirVersion: "R4", region: "US" },
  created_at: new Date("2025-01-05T00:00:00Z").toISOString(),
};

export const mockUsers: AppUser[] = [
  {
    id: "00000000-0000-0000-0000-000000000002",
    auth_user_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    organization_id: mockOrganization.id,
    email: "admin@northwind-health.test",
    full_name: "Northwind Admin",
    role: "admin",
    status: "active",
    created_at: new Date("2025-01-05T08:00:00Z").toISOString(),
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    auth_user_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    organization_id: mockOrganization.id,
    email: "provider@northwind-health.test",
    full_name: "Elena Park",
    role: "provider",
    status: "active",
    created_at: new Date("2025-01-05T08:05:00Z").toISOString(),
  },
];

export const mockPatients: Patient[] = [
  {
    id: "10000000-0000-0000-0000-000000000001",
    organization_id: mockOrganization.id,
    external_id: "EXT-1001",
    mrn: "MRN-1001",
    first_name: "Ava",
    last_name: "Miller",
    birth_date: "1989-01-02",
    gender: "female",
    phone: "+1-555-0100",
    email: "ava.miller@example.com",
    address: { line1: "200 Main St", city: "Boston", state: "MA" },
    fhir_resource_id: "70000000-0000-0000-0000-000000000001",
    created_by: mockUsers[0].id,
    created_at: new Date("2025-01-10T12:00:00Z").toISOString(),
  },
  {
    id: "10000000-0000-0000-0000-000000000002",
    organization_id: mockOrganization.id,
    external_id: "EXT-1002",
    mrn: "MRN-1002",
    first_name: "Marcus",
    last_name: "Reed",
    birth_date: "1978-07-21",
    gender: "male",
    phone: "+1-555-0101",
    email: "marcus.reed@example.com",
    address: { line1: "20 Cedar Ave", city: "Providence", state: "RI" },
    fhir_resource_id: "70000000-0000-0000-0000-000000000002",
    created_by: mockUsers[0].id,
    created_at: new Date("2025-01-12T15:30:00Z").toISOString(),
  },
];

export const mockProviders: Provider[] = [
  {
    id: "20000000-0000-0000-0000-000000000001",
    organization_id: mockOrganization.id,
    npi: "1234567890",
    first_name: "Elena",
    last_name: "Park",
    specialty: "Cardiology",
    email: "elena.park@example.com",
    phone: "+1-555-0200",
    fhir_resource_id: null,
    created_at: new Date("2025-01-08T09:00:00Z").toISOString(),
  },
  {
    id: "20000000-0000-0000-0000-000000000002",
    organization_id: mockOrganization.id,
    npi: "1234567891",
    first_name: "Daniel",
    last_name: "Nguyen",
    specialty: "Family Medicine",
    email: "daniel.nguyen@example.com",
    phone: "+1-555-0201",
    fhir_resource_id: null,
    created_at: new Date("2025-01-09T09:00:00Z").toISOString(),
  },
];

export const mockEncounters: Encounter[] = [
  {
    id: "40000000-0000-0000-0000-000000000001",
    organization_id: mockOrganization.id,
    patient_id: mockPatients[1].id,
    provider_id: mockProviders[1].id,
    status: "finished",
    class_code: "AMB",
    start_at: new Date("2025-01-12T16:00:00Z").toISOString(),
    end_at: new Date("2025-01-12T16:20:00Z").toISOString(),
    reason: "Routine blood pressure check",
    fhir_resource_id: null,
    created_at: new Date("2025-01-12T16:20:00Z").toISOString(),
  },
];

export const mockObservations: Observation[] = [
  {
    id: "50000000-0000-0000-0000-000000000001",
    organization_id: mockOrganization.id,
    patient_id: mockPatients[1].id,
    encounter_id: mockEncounters[0].id,
    code: "8480-6",
    display: "Systolic blood pressure",
    status: "final",
    value: { valueQuantity: { value: 122, unit: "mmHg" } },
    effective_at: new Date("2025-01-12T16:30:00Z").toISOString(),
    fhir_resource_id: "70000000-0000-0000-0000-000000000003",
    created_at: new Date("2025-01-12T16:30:00Z").toISOString(),
  },
];

export const mockConsents: Consent[] = [
  {
    id: "30000000-0000-0000-0000-000000000001",
    organization_id: mockOrganization.id,
    patient_id: mockPatients[0].id,
    status: "active",
    scope: "data-sharing",
    categories: ["treatment", "payment"],
    effective_from: new Date("2025-01-10T00:00:00Z").toISOString(),
    effective_to: null,
    source: "portal",
    fhir_resource_id: "70000000-0000-0000-0000-000000000004",
    created_by: mockUsers[0].id,
    created_at: new Date("2025-01-10T12:05:00Z").toISOString(),
  },
];

export const mockFhirResources: FhirResourceRecord[] = [
  {
    id: "70000000-0000-0000-0000-000000000001",
    organization_id: mockOrganization.id,
    resource_type: "Patient",
    version: 1,
    created_at: new Date("2025-01-10T12:00:00Z").toISOString(),
    resource: {
      resourceType: "Patient",
      id: mockPatients[0].id,
      name: [{ family: "Miller", given: ["Ava"] }],
      gender: "female",
      birthDate: "1989-01-02",
    },
  },
  {
    id: "70000000-0000-0000-0000-000000000002",
    organization_id: mockOrganization.id,
    resource_type: "Patient",
    version: 1,
    created_at: new Date("2025-01-12T15:30:00Z").toISOString(),
    resource: {
      resourceType: "Patient",
      id: mockPatients[1].id,
      name: [{ family: "Reed", given: ["Marcus"] }],
      gender: "male",
      birthDate: "1978-07-21",
    },
  },
  {
    id: "70000000-0000-0000-0000-000000000003",
    organization_id: mockOrganization.id,
    resource_type: "Observation",
    version: 1,
    created_at: new Date("2025-01-12T16:30:00Z").toISOString(),
    resource: {
      resourceType: "Observation",
      id: mockObservations[0].id,
      status: "final",
      code: {
        coding: [{ system: "http://loinc.org", code: "8480-6", display: "Systolic blood pressure" }],
        text: "Systolic blood pressure",
      },
      subject: { reference: `Patient/${mockPatients[1].id}` },
      encounter: { reference: `Encounter/${mockEncounters[0].id}` },
      effectiveDateTime: mockObservations[0].effective_at,
      valueQuantity: { value: 122, unit: "mmHg" },
    },
  },
  {
    id: "70000000-0000-0000-0000-000000000004",
    organization_id: mockOrganization.id,
    resource_type: "Consent",
    version: 1,
    created_at: new Date("2025-01-10T12:05:00Z").toISOString(),
    resource: {
      resourceType: "Consent",
      id: mockConsents[0].id,
      status: "active",
      patient: { reference: `Patient/${mockPatients[0].id}` },
    },
  },
];

export const mockWebhooks: WebhookSubscription[] = [
  {
    id: "80000000-0000-0000-0000-000000000001",
    organization_id: mockOrganization.id,
    name: "Population Health App",
    target_url: "https://example.com/hooks/interop",
    events: ["patient.created", "fhir.resource.created", "provider.created", "consent.created", "api_key.created"],
    secret_hash: null,
    status: "active",
    last_triggered_at: new Date("2025-01-13T11:00:00Z").toISOString(),
    created_at: new Date("2025-01-10T09:00:00Z").toISOString(),
  },
];

export const mockApiKeys: ApiKey[] = [
  {
    id: "90000000-0000-0000-0000-000000000001",
    organization_id: mockOrganization.id,
    user_id: mockUsers[0].id,
    name: "Sandbox Integration",
    key_prefix: "hp_live",
    key_hash: "hashed-demo-key",
    permissions: ["fhir.read", "fhir.write", "webhooks.read"],
    last_used_at: new Date("2025-01-14T10:00:00Z").toISOString(),
    revoked_at: null,
    created_at: new Date("2025-01-11T10:00:00Z").toISOString(),
  },
];

export const mockMetrics: DashboardMetrics = {
  totalPatients: mockPatients.length,
  totalProviders: mockProviders.length,
  fhirRecordsCount: mockFhirResources.length,
  consentOptInRate: 0.5,
};
