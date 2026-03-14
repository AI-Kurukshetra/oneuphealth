import type { FhirResourceType, UserRole } from "@/types/domain";

export type ImplementedFhirResourceType = Extract<
  FhirResourceType,
  "Patient" | "Observation" | "Encounter" | "Consent"
>;

export type FhirOperation = "list" | "read" | "create" | "update" | "delete";

interface FhirResourceSupport {
  resourceType: ImplementedFhirResourceType;
  operations: FhirOperation[];
  mutationRoles: UserRole[];
}

export const fhirResourceRegistry: Record<ImplementedFhirResourceType, FhirResourceSupport> = {
  Patient: {
    resourceType: "Patient",
    operations: ["list", "read", "create", "update", "delete"],
    mutationRoles: ["admin", "provider", "developer"],
  },
  Observation: {
    resourceType: "Observation",
    operations: ["list", "read", "create", "update", "delete"],
    mutationRoles: ["admin", "provider", "developer"],
  },
  Encounter: {
    resourceType: "Encounter",
    operations: ["list", "read", "create", "update", "delete"],
    mutationRoles: ["admin", "provider", "developer"],
  },
  Consent: {
    resourceType: "Consent",
    operations: ["list", "read", "create", "update", "delete"],
    mutationRoles: ["admin", "provider", "developer"],
  },
};

export const implementedFhirResourceTypes = Object.keys(
  fhirResourceRegistry,
) as ImplementedFhirResourceType[];

export function isImplementedFhirResourceType(
  value: string,
): value is ImplementedFhirResourceType {
  return value in fhirResourceRegistry;
}

export function getFhirResourceSupport(value: string) {
  if (!isImplementedFhirResourceType(value)) {
    return null;
  }

  return fhirResourceRegistry[value];
}
