import { ok } from "@/lib/api";
import { fhirResourceRegistry, implementedFhirResourceTypes } from "@/lib/fhir/registry";

export async function GET() {
  return ok({
    data: {
      resourceTypes: implementedFhirResourceTypes,
      operations: implementedFhirResourceTypes.reduce<Record<string, string[]>>((accumulator, type) => {
        accumulator[type] = fhirResourceRegistry[type].operations;
        return accumulator;
      }, {}),
    },
  });
}
