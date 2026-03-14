import type { ConsentInput, PatientInput, ProviderInput } from "@/types/api";
import type { FhirResourceType } from "@/types/domain";

export function isSupportedFhirResourceType(value: string): value is FhirResourceType {
  return [
    "Patient",
    "Observation",
    "Encounter",
    "Condition",
    "Medication",
    "Procedure",
    "Claim",
    "Consent",
  ].includes(value);
}

export function buildPatientResource(id: string, input: PatientInput) {
  return {
    resourceType: "Patient",
    id,
    identifier: input.mrn ? [{ system: "urn:mrn", value: input.mrn }] : [],
    name: [{ family: input.lastName, given: [input.firstName] }],
    gender: input.gender,
    birthDate: input.birthDate,
    telecom: [
      input.phone ? { system: "phone", value: input.phone } : null,
      input.email ? { system: "email", value: input.email } : null,
    ].filter(Boolean),
  };
}

export function buildProviderResource(id: string, input: ProviderInput) {
  return {
    resourceType: "Practitioner",
    id,
    identifier: input.npi ? [{ system: "urn:npi", value: input.npi }] : [],
    name: [{ family: input.lastName, given: [input.firstName] }],
    qualification: input.specialty ? [{ code: { text: input.specialty } }] : [],
    telecom: [
      input.phone ? { system: "phone", value: input.phone } : null,
      input.email ? { system: "email", value: input.email } : null,
    ].filter(Boolean),
  };
}

export function buildConsentResource(id: string, input: ConsentInput) {
  return {
    resourceType: "Consent",
    id,
    status: input.status,
    scope: {
      text: input.scope,
    },
    category: input.categories.map((category) => ({
      text: category,
    })),
    patient: {
      reference: `Patient/${input.patientId}`,
    },
  };
}

export function normalizeFhirResource(
  resourceType: FhirResourceType,
  resource: Record<string, unknown>,
) {
  const candidateType = typeof resource.resourceType === "string" ? resource.resourceType : resourceType;

  if (candidateType !== resourceType) {
    throw new Error(`FHIR resourceType mismatch: expected ${resourceType}, received ${candidateType}`);
  }

  return {
    ...resource,
    resourceType,
    id: typeof resource.id === "string" && resource.id.length > 0 ? resource.id : crypto.randomUUID(),
  };
}

export function getReferenceId(reference?: string | null) {
  if (!reference) {
    return null;
  }

  const match = reference.match(/(?:^|\/)([A-Za-z]+)\/([^/?#]+)/);
  if (!match) {
    return null;
  }

  return {
    resourceType: match[1],
    id: match[2],
  };
}

export function getPatientName(resource: Record<string, unknown>) {
  const names = Array.isArray(resource.name) ? resource.name : [];
  const first = names[0] as Record<string, unknown> | undefined;
  const given = Array.isArray(first?.given) ? first.given.filter((value): value is string => typeof value === "string") : [];

  return {
    firstName: given[0] ?? "Unknown",
    lastName: typeof first?.family === "string" ? first.family : "Unknown",
  };
}

export function getTelecomValue(resource: Record<string, unknown>, system: "email" | "phone") {
  const telecom = Array.isArray(resource.telecom) ? resource.telecom : [];

  for (const entry of telecom) {
    if (!entry || typeof entry !== "object") {
      continue;
    }

    const candidate = entry as Record<string, unknown>;
    if (candidate.system === system && typeof candidate.value === "string") {
      return candidate.value;
    }
  }

  return null;
}

export function getMrn(resource: Record<string, unknown>) {
  const identifiers = Array.isArray(resource.identifier) ? resource.identifier : [];

  for (const entry of identifiers) {
    if (!entry || typeof entry !== "object") {
      continue;
    }

    const identifier = entry as Record<string, unknown>;
    if (identifier.system === "urn:mrn" && typeof identifier.value === "string") {
      return identifier.value;
    }
  }

  return null;
}

export function getAddress(resource: Record<string, unknown>) {
  const addresses = Array.isArray(resource.address) ? resource.address : [];
  const first = addresses[0] as Record<string, unknown> | undefined;

  if (!first) {
    return null;
  }

  const line = Array.isArray(first.line) ? first.line.filter((value): value is string => typeof value === "string") : [];

  return {
    line1: line[0] ?? null,
    line2: line[1] ?? null,
    city: typeof first.city === "string" ? first.city : null,
    state: typeof first.state === "string" ? first.state : null,
    postalCode: typeof first.postalCode === "string" ? first.postalCode : null,
    country: typeof first.country === "string" ? first.country : null,
  };
}

export function getObservationValue(resource: Record<string, unknown>) {
  const valueKeys = [
    "valueQuantity",
    "valueString",
    "valueBoolean",
    "valueInteger",
    "valueCodeableConcept",
    "valueRange",
  ] as const;

  for (const key of valueKeys) {
    if (key in resource) {
      return { [key]: resource[key] };
    }
  }

  return null;
}

export function getObservationCode(resource: Record<string, unknown>) {
  const code = (resource.code ?? null) as Record<string, unknown> | null;
  const coding = Array.isArray(code?.coding) ? code?.coding : [];
  const firstCoding = coding[0] as Record<string, unknown> | undefined;

  return {
    code: typeof firstCoding?.code === "string" ? firstCoding.code : typeof code?.text === "string" ? code.text : "unknown",
    display:
      typeof code?.text === "string"
        ? code.text
        : typeof firstCoding?.display === "string"
          ? firstCoding.display
          : null,
  };
}

export function getEncounterReason(resource: Record<string, unknown>) {
  const reasonCode = Array.isArray(resource.reasonCode) ? resource.reasonCode : [];
  const first = reasonCode[0] as Record<string, unknown> | undefined;
  const coding = Array.isArray(first?.coding) ? first.coding : [];
  const firstCoding = coding[0] as Record<string, unknown> | undefined;

  if (typeof first?.text === "string") {
    return first.text;
  }

  if (typeof firstCoding?.display === "string") {
    return firstCoding.display;
  }

  if (typeof firstCoding?.code === "string") {
    return firstCoding.code;
  }

  return null;
}
