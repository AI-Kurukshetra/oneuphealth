import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { AuditLog } from "@/types/domain";

const inMemoryAuditLogs: AuditLog[] = [];

export const auditRepository = {
  async create(payload: Omit<AuditLog, "created_at"> & { created_at?: string }) {
    const supabase = createSupabaseAdminClient();
    const record = {
      ...payload,
      created_at: payload.created_at ?? new Date().toISOString(),
    };

    if (!supabase) {
      inMemoryAuditLogs.unshift(record as AuditLog);
      return record as AuditLog;
    }

    const { data, error } = await supabase
      .from("audit_logs")
      .insert(record)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data as AuditLog;
  },

  async listByOrganization(organizationId: string) {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      return inMemoryAuditLogs.filter((entry) => entry.organization_id === organizationId);
    }

    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .eq("organization_id", organizationId)
      .order("timestamp", { ascending: false });

    if (error) {
      throw error;
    }

    return data as AuditLog[];
  },
};
