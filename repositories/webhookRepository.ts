import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { mockWebhooks } from "@/lib/mock-data";
import type { WebhookSubscription } from "@/types/domain";

export const webhookRepository = {
  async listByOrganization(organizationId: string) {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      return mockWebhooks.filter((webhook) => webhook.organization_id === organizationId);
    }

    const { data, error } = await supabase
      .from("webhooks")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data as WebhookSubscription[];
  },

  async create(payload: Omit<WebhookSubscription, "created_at"> & { created_at?: string }) {
    const supabase = createSupabaseAdminClient();
    const record = {
      ...payload,
      created_at: payload.created_at ?? new Date().toISOString(),
    };

    if (!supabase) {
      mockWebhooks.unshift(record as WebhookSubscription);
      return record as WebhookSubscription;
    }

    const { data, error } = await supabase
      .from("webhooks")
      .insert(record)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data as WebhookSubscription;
  },

  async updateLastTriggeredAt(organizationId: string, id: string, timestamp: string) {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      const existing = mockWebhooks.find(
        (webhook) => webhook.organization_id === organizationId && webhook.id === id,
      );

      if (!existing) {
        return null;
      }

      existing.last_triggered_at = timestamp;
      return existing;
    }

    const { data, error } = await supabase
      .from("webhooks")
      .update({ last_triggered_at: timestamp })
      .eq("organization_id", organizationId)
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) {
      throw error;
    }

    return (data as WebhookSubscription | null) ?? null;
  },
};
