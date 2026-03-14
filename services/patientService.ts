import { buildPatientResource } from "@/lib/fhir/resources";
import { assertRole } from "@/lib/auth/session";
import { patientInputSchema } from "@/lib/validators";
import { patientRepository } from "@/repositories/patientRepository";
import { auditService } from "@/services/auditService";
import { fhirService } from "@/services/fhirService";
import { webhookService } from "@/services/webhookService";
import type { PatientInput } from "@/types/api";
import type { RequestContext } from "@/types/domain";

export const patientService = {
  async listPatients(context: RequestContext) {
    return patientRepository.listByOrganization(context.organizationId);
  },

  async getPatient(context: RequestContext, id: string) {
    return patientRepository.getById(context.organizationId, id);
  },

  async createPatient(context: RequestContext, input: PatientInput) {
    assertRole(context.role, ["admin", "provider"]);
    const payload = patientInputSchema.parse(input);
    const patientId = crypto.randomUUID();
    const fhirResource = buildPatientResource(patientId, payload);
    const storedFhir = await fhirService.createResource({
      organizationId: context.organizationId,
      resourceType: "Patient",
      resource: fhirResource,
    });

    const patient = await patientRepository.create({
      id: patientId,
      organization_id: context.organizationId,
      external_id: null,
      mrn: payload.mrn ?? null,
      first_name: payload.firstName,
      last_name: payload.lastName,
      birth_date: payload.birthDate ?? null,
      gender: payload.gender ?? null,
      phone: payload.phone ?? null,
      email: payload.email || null,
      address: null,
      fhir_resource_id: storedFhir.id,
      created_by: context.userId,
    });

    await auditService.log({
      organizationId: context.organizationId,
      userId: context.userId,
      action: "patient.created",
      resourceType: "patient",
      resourceId: patient.id,
      metadata: { fhirResourceId: storedFhir.id },
    });

    await webhookService.emitEvent({
      organizationId: context.organizationId,
      event: "patient.created",
      resourceType: "patient",
      resourceId: patient.id,
      payload: {
        patientId: patient.id,
        fhirResourceId: storedFhir.id,
      },
    });

    return patient;
  },
};
