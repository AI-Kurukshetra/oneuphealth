import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { mockProviders } from "@/lib/mock-data";
import type { Provider } from "@/types/domain";

export const providerRepository = {
  async listByOrganization(organizationId: string) {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      return mockProviders.filter((provider) => provider.organization_id === organizationId);
    }

    const { data, error } = await supabase
      .from("providers")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data as Provider[];
  },

  async getById(organizationId: string, id: string) {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      return (
        mockProviders.find(
          (provider) => provider.organization_id === organizationId && provider.id === id,
        ) ?? null
      );
    }

    const { data, error } = await supabase
      .from("providers")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return (data as Provider | null) ?? null;
  },

  async create(payload: Omit<Provider, "created_at"> & { created_at?: string }) {
    const supabase = createSupabaseAdminClient();
    const record = {
      ...payload,
      created_at: payload.created_at ?? new Date().toISOString(),
    };

    if (!supabase) {
      mockProviders.unshift(record as Provider);
      return record as Provider;
    }

    const { data, error } = await supabase
      .from("providers")
      .insert(record)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data as Provider;
  },

  async update(
    organizationId: string,
    id: string,
    payload: Partial<Omit<Provider, "id" | "organization_id" | "created_at">>,
  ) {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      const provider = mockProviders.find(
        (record) => record.organization_id === organizationId && record.id === id,
      );

      if (!provider) {
        return null;
      }

      Object.assign(provider, payload);
      return provider;
    }

    const { data, error } = await supabase
      .from("providers")
      .update(payload)
      .eq("organization_id", organizationId)
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) {
      throw error;
    }

    return (data as Provider | null) ?? null;
  },
};
