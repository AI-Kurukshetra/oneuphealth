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

  async getById(organizationId: string, id: string) {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      return (
        mockConsents.find(
          (consent) => consent.organization_id === organizationId && consent.id === id,
        ) ?? null
      );
    }

    const { data, error } = await supabase
      .from("consents")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return (data as Consent | null) ?? null;
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

  async update(
    organizationId: string,
    id: string,
    payload: Partial<Omit<Consent, "id" | "organization_id" | "created_at">>,
  ) {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      const consent = mockConsents.find(
        (record) => record.organization_id === organizationId && record.id === id,
      );

      if (!consent) {
        return null;
      }

      Object.assign(consent, payload);
      return consent;
    }

    const { data, error } = await supabase
      .from("consents")
      .update(payload)
      .eq("organization_id", organizationId)
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) {
      throw error;
    }

    return (data as Consent | null) ?? null;
  },

  async delete(organizationId: string, id: string) {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      const index = mockConsents.findIndex(
        (record) => record.organization_id === organizationId && record.id === id,
      );

      if (index < 0) {
        return false;
      }

      mockConsents.splice(index, 1);
      return true;
    }

    const { error, count } = await supabase
      .from("consents")
      .delete({ count: "exact" })
      .eq("organization_id", organizationId)
      .eq("id", id);

    if (error) {
      throw error;
    }

    return (count ?? 0) > 0;
  },
};
