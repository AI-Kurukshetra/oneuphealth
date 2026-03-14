import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { mockEncounters } from "@/lib/mock-data";
import type { Encounter } from "@/types/domain";

export const encounterRepository = {
  async listByOrganization(organizationId: string) {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      return mockEncounters.filter((encounter) => encounter.organization_id === organizationId);
    }

    const { data, error } = await supabase
      .from("encounters")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data as Encounter[];
  },

  async getById(organizationId: string, id: string) {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      return (
        mockEncounters.find(
          (encounter) => encounter.organization_id === organizationId && encounter.id === id,
        ) ?? null
      );
    }

    const { data, error } = await supabase
      .from("encounters")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return (data as Encounter | null) ?? null;
  },

  async create(payload: Omit<Encounter, "created_at"> & { created_at?: string }) {
    const supabase = createSupabaseAdminClient();
    const record = {
      ...payload,
      created_at: payload.created_at ?? new Date().toISOString(),
    };

    if (!supabase) {
      mockEncounters.unshift(record as Encounter);
      return record as Encounter;
    }

    const { data, error } = await supabase
      .from("encounters")
      .insert(record)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data as Encounter;
  },

  async update(
    organizationId: string,
    id: string,
    payload: Partial<Omit<Encounter, "id" | "organization_id" | "created_at">>,
  ) {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      const encounter = mockEncounters.find(
        (record) => record.organization_id === organizationId && record.id === id,
      );

      if (!encounter) {
        return null;
      }

      Object.assign(encounter, payload);
      return encounter;
    }

    const { data, error } = await supabase
      .from("encounters")
      .update(payload)
      .eq("organization_id", organizationId)
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) {
      throw error;
    }

    return (data as Encounter | null) ?? null;
  },

  async delete(organizationId: string, id: string) {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      const index = mockEncounters.findIndex(
        (record) => record.organization_id === organizationId && record.id === id,
      );

      if (index < 0) {
        return false;
      }

      mockEncounters.splice(index, 1);
      return true;
    }

    const { error, count } = await supabase
      .from("encounters")
      .delete({ count: "exact" })
      .eq("organization_id", organizationId)
      .eq("id", id);

    if (error) {
      throw error;
    }

    return (count ?? 0) > 0;
  },
};
