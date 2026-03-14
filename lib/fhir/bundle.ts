import type { FhirResourceRecord } from "@/types/domain";

export function buildFhirBundle(records: FhirResourceRecord[], requestUrl?: string) {
  const selfUrl = requestUrl ?? null;

  return {
    resourceType: "Bundle",
    type: "searchset",
    total: records.length,
    link: selfUrl ? [{ relation: "self", url: selfUrl }] : [],
    entry: records.map((record) => {
      const resource = record.resource;
      const resourceType =
        typeof resource.resourceType === "string" ? resource.resourceType : record.resource_type;
      const resourceId = typeof resource.id === "string" ? resource.id : record.id;

      return {
        fullUrl: selfUrl ? `${new URL(selfUrl).origin}/api/fhir/${resourceType}/${resourceId}` : undefined,
        resource,
        search: {
          mode: "match",
        },
      };
    }),
  };
}
