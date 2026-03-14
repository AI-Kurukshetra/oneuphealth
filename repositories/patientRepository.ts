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

  async update(
    organizationId: string,
    id: string,
    payload: Partial<Omit<Patient, "id" | "organization_id" | "created_at">>,
  ) {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      const patient = mockPatients.find(
        (record) => record.organization_id === organizationId && record.id === id,
      );

      if (!patient) {
        return null;
      }

      Object.assign(patient, payload);
      return patient;
    }

    const { data, error } = await supabase
      .from("patients")
      .update(payload)
      .eq("organization_id", organizationId)
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) {
      throw error;
    }

    return (data as Patient | null) ?? null;
  },

  async delete(organizationId: string, id: string) {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      const index = mockPatients.findIndex(
        (record) => record.organization_id === organizationId && record.id === id,
      );

      if (index < 0) {
        return false;
      }

      mockPatients.splice(index, 1);
      return true;
    }

    const { error, count } = await supabase
      .from("patients")
      .delete({ count: "exact" })
      .eq("organization_id", organizationId)
      .eq("id", id);

    if (error) {
      throw error;
    }

    return (count ?? 0) > 0;
  },
};
