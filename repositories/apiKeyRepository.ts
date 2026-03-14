import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { mockApiKeys } from "@/lib/mock-data";
import type { ApiKey } from "@/types/domain";

export const apiKeyRepository = {
  async listByOrganization(organizationId: string) {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      return mockApiKeys.filter((apiKey) => apiKey.organization_id === organizationId);
    }

    const { data, error } = await supabase
      .from("api_keys")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data as ApiKey[];
  },

  async getByHash(keyHash: string) {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      return mockApiKeys.find((apiKey) => apiKey.key_hash === keyHash && !apiKey.revoked_at) ?? null;
    }

    const { data, error } = await supabase
      .from("api_keys")
      .select("*")
      .eq("key_hash", keyHash)
      .is("revoked_at", null)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return (data as ApiKey | null) ?? null;
  },

  async create(payload: Omit<ApiKey, "created_at"> & { created_at?: string }) {
    const supabase = createSupabaseAdminClient();
    const record = {
      ...payload,
      created_at: payload.created_at ?? new Date().toISOString(),
    };

    if (!supabase) {
      mockApiKeys.unshift(record as ApiKey);
      return record as ApiKey;
    }

    const { data, error } = await supabase
      .from("api_keys")
      .insert(record)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data as ApiKey;
  },
};
