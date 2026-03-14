import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { mockConsents } from "@/lib/mock-data";
import type { Consent } from "@/types/domain";

export const consentRepository = {
  async listByOrganization(organizationId: string) {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      return mockConsents.filter((consent) => consent.organization_id === organizationId);
    }

    const { data, error } = await supabase
      .from("consents")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data as Consent[];
  },

  async create(payload: Omit<Consent, "created_at"> & { created_at?: string }) {
    const supabase = createSupabaseAdminClient();
    const record = {
      ...payload,
      created_at: payload.created_at ?? new Date().toISOString(),
    };

    if (!supabase) {
      mockConsents.unshift(record as Consent);
      return record as Consent;
    }

    const { data, error } = await supabase
      .from("consents")
      .insert(record)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data as Consent;
  },
};
