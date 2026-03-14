import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { mockObservations } from "@/lib/mock-data";
import type { Observation } from "@/types/domain";

export const observationRepository = {
  async listByOrganization(organizationId: string) {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      return mockObservations.filter((observation) => observation.organization_id === organizationId);
    }

    const { data, error } = await supabase
      .from("observations")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data as Observation[];
  },

  async getById(organizationId: string, id: string) {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      return (
        mockObservations.find(
          (observation) => observation.organization_id === organizationId && observation.id === id,
        ) ?? null
      );
    }

    const { data, error } = await supabase
      .from("observations")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return (data as Observation | null) ?? null;
  },

  async create(payload: Omit<Observation, "created_at"> & { created_at?: string }) {
    const supabase = createSupabaseAdminClient();
    const record = {
      ...payload,
      created_at: payload.created_at ?? new Date().toISOString(),
    };

    if (!supabase) {
      mockObservations.unshift(record as Observation);
      return record as Observation;
    }

    const { data, error } = await supabase
      .from("observations")
      .insert(record)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data as Observation;
  },
};
