import {
  getAddress,
  getEncounterReason,
  getMrn,
  getObservationCode,
  getObservationValue,
  getPatientName,
  getReferenceId,
  getTelecomValue,
  isSupportedFhirResourceType,
  normalizeFhirResource,
} from "@/lib/fhir/resources";
import { consentRepository } from "@/repositories/consentRepository";
import { encounterRepository } from "@/repositories/encounterRepository";
import { fhirRepository } from "@/repositories/fhirRepository";
import { observationRepository } from "@/repositories/observationRepository";
import { patientRepository } from "@/repositories/patientRepository";
import { providerRepository } from "@/repositories/providerRepository";
import type { FhirResourceRecord, FhirResourceType } from "@/types/domain";

interface CreateResourceInput {
  organizationId: string;
  resourceType: string;
  resource: Record<string, unknown>;
  syncOperational?: boolean;
  userId?: string;
}

export const fhirService = {
  async listResources(organizationId: string, resourceType?: FhirResourceType) {
    return fhirRepository.listByOrganization(organizationId, resourceType);
  },

  async getResource(organizationId: string, id: string) {
    return fhirRepository.getById(organizationId, id);
  },

  async createResource(input: CreateResourceInput): Promise<FhirResourceRecord> {
    if (!isSupportedFhirResourceType(input.resourceType)) {
      throw new Error("Unsupported FHIR resource type");
    }

    const normalizedResource = normalizeFhirResource(input.resourceType, input.resource);
    const storedResource = await fhirRepository.create({
      id: crypto.randomUUID(),
      organization_id: input.organizationId,
      resource_type: input.resourceType,
      resource: normalizedResource,
      version: 1,
    });

    if (input.syncOperational) {
      await syncOperationalResource({
        organizationId: input.organizationId,
        userId: input.userId ?? null,
        resourceType: input.resourceType,
        resource: normalizedResource,
        storedResourceId: storedResource.id,
      });
    }

    return storedResource;
  },
};

async function syncOperationalResource(input: {
  organizationId: string;
  userId: string | null;
  resourceType: FhirResourceType;
  resource: Record<string, unknown>;
  storedResourceId: string;
}) {
  switch (input.resourceType) {
    case "Patient":
      await syncPatientResource(input);
      return;
    case "Observation":
      await syncObservationResource(input);
      return;
    case "Encounter":
      await syncEncounterResource(input);
      return;
    case "Consent":
      await syncConsentResource(input);
      return;
    default:
      return;
  }
}

async function syncPatientResource(input: {
  organizationId: string;
  userId: string | null;
  resource: Record<string, unknown>;
  storedResourceId: string;
}) {
  const { firstName, lastName } = getPatientName(input.resource);

  await patientRepository.create({
    id: input.resource.id as string,
    organization_id: input.organizationId,
    external_id: null,
    mrn: getMrn(input.resource),
    first_name: firstName,
    last_name: lastName,
    birth_date: typeof input.resource.birthDate === "string" ? input.resource.birthDate : null,
    gender: typeof input.resource.gender === "string" ? input.resource.gender : null,
    phone: getTelecomValue(input.resource, "phone"),
    email: getTelecomValue(input.resource, "email"),
    address: getAddress(input.resource),
    fhir_resource_id: input.storedResourceId,
    created_by: input.userId,
  });
}

async function syncObservationResource(input: {
  organizationId: string;
  resource: Record<string, unknown>;
  storedResourceId: string;
}) {
  if (typeof input.resource.status !== "string") {
    throw new Error("Observation.status is required");
  }

  const patientReference = getReferenceId((input.resource.subject as { reference?: string } | undefined)?.reference);
  if (!patientReference || patientReference.resourceType !== "Patient") {
    throw new Error("Observation.subject must reference a Patient resource");
  }

  const patient = await patientRepository.getById(input.organizationId, patientReference.id);
  if (!patient) {
    throw new Error("Observation.subject must reference a patient in the same organization");
  }

  const encounterReference = getReferenceId((input.resource.encounter as { reference?: string } | undefined)?.reference);
  let encounterId: string | null = null;

  if (encounterReference) {
    if (encounterReference.resourceType !== "Encounter") {
      throw new Error("Observation.encounter must reference an Encounter resource");
    }

    const encounter = await encounterRepository.getById(input.organizationId, encounterReference.id);
    if (!encounter) {
      throw new Error("Observation.encounter must reference an encounter in the same organization");
    }

    encounterId = encounter.id;
  }

  const code = getObservationCode(input.resource);

  await observationRepository.create({
    id: input.resource.id as string,
    organization_id: input.organizationId,
    patient_id: patient.id,
    encounter_id: encounterId,
    code: code.code,
    display: code.display,
    status: input.resource.status,
    value: getObservationValue(input.resource),
    effective_at:
      typeof input.resource.effectiveDateTime === "string" ? input.resource.effectiveDateTime : null,
    fhir_resource_id: input.storedResourceId,
  });
}

async function syncEncounterResource(input: {
  organizationId: string;
  resource: Record<string, unknown>;
  storedResourceId: string;
}) {
  if (typeof input.resource.status !== "string") {
    throw new Error("Encounter.status is required");
  }

  const patientReference = getReferenceId((input.resource.subject as { reference?: string } | undefined)?.reference);
  if (!patientReference || patientReference.resourceType !== "Patient") {
    throw new Error("Encounter.subject must reference a Patient resource");
  }

  const patient = await patientRepository.getById(input.organizationId, patientReference.id);
  if (!patient) {
    throw new Error("Encounter.subject must reference a patient in the same organization");
  }

  const participants = Array.isArray(input.resource.participant) ? input.resource.participant : [];
  let providerId: string | null = null;

  for (const participant of participants) {
    if (!participant || typeof participant !== "object") {
      continue;
    }

    const individual = (participant as { individual?: { reference?: string }; actor?: { reference?: string } }).individual;
    const actor = (participant as { actor?: { reference?: string } }).actor;
    const reference = individual?.reference ?? actor?.reference;
    const parsed = getReferenceId(reference);

    if (!parsed) {
      continue;
    }

    if (!["Practitioner", "Provider"].includes(parsed.resourceType)) {
      throw new Error("Encounter.participant must reference a provider or practitioner resource");
    }

    const provider = await providerRepository.getById(input.organizationId, parsed.id);
    if (!provider) {
      throw new Error("Encounter.participant must reference a provider in the same organization");
    }

    providerId = provider.id;
    break;
  }

  const encounterClass = (input.resource.class ?? null) as { code?: unknown } | null;
  const period = (input.resource.period ?? null) as { start?: unknown; end?: unknown } | null;

  await encounterRepository.create({
    id: input.resource.id as string,
    organization_id: input.organizationId,
    patient_id: patient.id,
    provider_id: providerId,
    status: input.resource.status,
    class_code: typeof encounterClass?.code === "string" ? encounterClass.code : null,
    start_at: typeof period?.start === "string" ? period.start : null,
    end_at: typeof period?.end === "string" ? period.end : null,
    reason: getEncounterReason(input.resource),
    fhir_resource_id: input.storedResourceId,
  });
}

async function syncConsentResource(input: {
  organizationId: string;
  userId: string | null;
  resource: Record<string, unknown>;
  storedResourceId: string;
}) {
  if (typeof input.resource.status !== "string") {
    throw new Error("Consent.status is required");
  }

  const patientReference = getReferenceId((input.resource.patient as { reference?: string } | undefined)?.reference);
  if (!patientReference || patientReference.resourceType !== "Patient") {
    throw new Error("Consent.patient must reference a Patient resource");
  }

  const patient = await patientRepository.getById(input.organizationId, patientReference.id);
  if (!patient) {
    throw new Error("Consent.patient must reference a patient in the same organization");
  }

  const scope = (input.resource.scope ?? null) as { text?: unknown } | null;
  const categories = Array.isArray(input.resource.category) ? input.resource.category : [];

  await consentRepository.create({
    id: input.resource.id as string,
    organization_id: input.organizationId,
    patient_id: patient.id,
    status: input.resource.status,
    scope: typeof scope?.text === "string" ? scope.text : "general",
    categories: categories
      .map((entry) => (entry && typeof entry === "object" ? ((entry as { text?: unknown }).text ?? null) : null))
      .filter((value): value is string => typeof value === "string" && value.length > 0),
    effective_from: new Date().toISOString(),
    effective_to: null,
    source: "fhir",
    fhir_resource_id: input.storedResourceId,
    created_by: input.userId,
  });
}
