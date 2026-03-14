import { buildPatientResource } from "@/lib/fhir/resources";
import { assertRole } from "@/lib/auth/session";
import { patientInputSchema } from "@/lib/validators";
import { fhirRepository } from "@/repositories/fhirRepository";
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

  async updatePatient(context: RequestContext, id: string, input: PatientInput) {
    assertRole(context.role, ["admin", "provider"]);
    const payload = patientInputSchema.parse(input);
    const existingPatient = await patientRepository.getById(context.organizationId, id);

    if (!existingPatient) {
      throw new Error("Patient not found");
    }

    const updatedPatient = await patientRepository.update(context.organizationId, id, {
      mrn: payload.mrn ?? null,
      first_name: payload.firstName,
      last_name: payload.lastName,
      birth_date: payload.birthDate ?? null,
      gender: payload.gender ?? null,
      phone: payload.phone ?? null,
      email: payload.email || null,
    });

    if (!updatedPatient) {
      throw new Error("Patient update failed");
    }

    if (existingPatient.fhir_resource_id) {
      const existingFhir = await fhirRepository.getById(
        context.organizationId,
        existingPatient.fhir_resource_id,
      );

      if (existingFhir) {
        await fhirRepository.update(context.organizationId, existingFhir.id, {
          resource: buildPatientResource(id, payload),
          version: existingFhir.version + 1,
        });
      }
    }

    await auditService.log({
      organizationId: context.organizationId,
      userId: context.userId,
      action: "patient.updated",
      resourceType: "patient",
      resourceId: updatedPatient.id,
      metadata: { fhirResourceId: existingPatient.fhir_resource_id },
    });

    await webhookService.emitEvent({
      organizationId: context.organizationId,
      event: "patient.updated",
      resourceType: "patient",
      resourceId: updatedPatient.id,
      payload: {
        patientId: updatedPatient.id,
        fhirResourceId: existingPatient.fhir_resource_id,
      },
    });

    return updatedPatient;
  },
};
