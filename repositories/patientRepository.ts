import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { mockPatients } from "@/lib/mock-data";
import type { Patient } from "@/types/domain";

export const patientRepository = {
  async listByOrganization(organizationId: string) {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      return mockPatients.filter((patient) => patient.organization_id === organizationId);
    }

    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data as Patient[];
  },

  async getById(organizationId: string, id: string) {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      return (
        mockPatients.find(
          (patient) => patient.organization_id === organizationId && patient.id === id,
        ) ?? null
      );
    }

    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return (data as Patient | null) ?? null;
  },

  async create(payload: Omit<Patient, "created_at"> & { created_at?: string }) {
    const supabase = createSupabaseAdminClient();
    const record = {
      ...payload,
      created_at: payload.created_at ?? new Date().toISOString(),
    };

    if (!supabase) {
      mockPatients.unshift(record as Patient);
      return record as Patient;
    }

    const { data, error } = await supabase
      .from("patients")
      .insert(record)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data as Patient;
  },
};
