import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { mockFhirResources } from "@/lib/mock-data";
import type { FhirResourceRecord, FhirResourceType } from "@/types/domain";

export const fhirRepository = {
  async listByOrganization(organizationId: string, resourceType?: FhirResourceType) {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      return mockFhirResources.filter(
        (resource) =>
          resource.organization_id === organizationId &&
          (!resourceType || resource.resource_type === resourceType),
      );
    }

    let query = supabase
      .from("fhir_resources")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });

    if (resourceType) {
      query = query.eq("resource_type", resourceType);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data as FhirResourceRecord[];
  },

  async getById(organizationId: string, id: string) {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      return (
        mockFhirResources.find(
          (resource) => resource.organization_id === organizationId && resource.id === id,
        ) ?? null
      );
    }

    const { data, error } = await supabase
      .from("fhir_resources")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return (data as FhirResourceRecord | null) ?? null;
  },

  async create(payload: Omit<FhirResourceRecord, "created_at"> & { created_at?: string }) {
    const supabase = createSupabaseAdminClient();
    const record = {
      ...payload,
      created_at: payload.created_at ?? new Date().toISOString(),
    };

    if (!supabase) {
      mockFhirResources.unshift(record as FhirResourceRecord);
      return record as FhirResourceRecord;
    }

    const { data, error } = await supabase
      .from("fhir_resources")
      .insert(record)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data as FhirResourceRecord;
  },
};
