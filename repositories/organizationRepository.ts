import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { mockOrganization } from "@/lib/mock-data";
import type { Organization } from "@/types/domain";

export const organizationRepository = {
  async getById(id: string) {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      return mockOrganization.id === id ? mockOrganization : null;
    }

    const { data, error } = await supabase.from("organizations").select("*").eq("id", id).maybeSingle();

    if (error) {
      throw error;
    }

    return (data as Organization | null) ?? null;
  },

  async listByIds(ids: string[]) {
    const uniqueIds = Array.from(new Set(ids.filter(Boolean)));

    if (uniqueIds.length === 0) {
      return [];
    }

    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      return uniqueIds.includes(mockOrganization.id) ? [mockOrganization] : [];
    }

    const { data, error } = await supabase.from("organizations").select("*").in("id", uniqueIds);

    if (error) {
      throw error;
    }

    return data as Organization[];
  },

  async create(payload: Omit<Organization, "created_at"> & { created_at?: string }) {
    const supabase = createSupabaseAdminClient();
    const record = {
      ...payload,
      created_at: payload.created_at ?? new Date().toISOString(),
    };

    if (!supabase) {
      return record as Organization;
    }

    const { data, error } = await supabase.from("organizations").insert(record).select("*").single();

    if (error) {
      throw error;
    }

    return data as Organization;
  },
};
