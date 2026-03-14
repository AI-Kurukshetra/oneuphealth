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

  async getByResourceId(organizationId: string, resourceType: FhirResourceType, resourceId: string) {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      return (
        mockFhirResources.find(
          (resource) =>
            resource.organization_id === organizationId &&
            resource.resource_type === resourceType &&
            resource.resource.id === resourceId,
        ) ?? null
      );
    }

    const { data, error } = await supabase
      .from("fhir_resources")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("resource_type", resourceType)
      .filter("resource->>id", "eq", resourceId)
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

  async update(
    organizationId: string,
    id: string,
    payload: Partial<Pick<FhirResourceRecord, "resource" | "version">>,
  ) {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      const resource = mockFhirResources.find(
        (record) => record.organization_id === organizationId && record.id === id,
      );

      if (!resource) {
        return null;
      }

      Object.assign(resource, payload);
      return resource;
    }

    const { data, error } = await supabase
      .from("fhir_resources")
      .update(payload)
      .eq("organization_id", organizationId)
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) {
      throw error;
    }

    return (data as FhirResourceRecord | null) ?? null;
  },

  async delete(organizationId: string, id: string) {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      const index = mockFhirResources.findIndex(
        (record) => record.organization_id === organizationId && record.id === id,
      );

      if (index < 0) {
        return false;
      }

      mockFhirResources.splice(index, 1);
      return true;
    }

    const { error, count } = await supabase
      .from("fhir_resources")
      .delete({ count: "exact" })
      .eq("organization_id", organizationId)
      .eq("id", id);

    if (error) {
      throw error;
    }

    return (count ?? 0) > 0;
  },
};
