import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { mockUsers } from "@/lib/mock-data";
import type { AppUser } from "@/types/domain";

export const userRepository = {
  async listByOrganization(organizationId: string) {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      return mockUsers.filter((user) => user.organization_id === organizationId);
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data as AppUser[];
  },

  async getById(id: string) {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      return mockUsers.find((user) => user.id === id) ?? null;
    }

    const { data, error } = await supabase.from("users").select("*").eq("id", id).maybeSingle();

    if (error) {
      throw error;
    }

    return (data as AppUser | null) ?? null;
  },

  async getByAuthUserId(authUserId: string) {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      return mockUsers.find((user) => user.auth_user_id === authUserId) ?? null;
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("auth_user_id", authUserId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return (data as AppUser | null) ?? null;
  },
};
