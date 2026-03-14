import { buildConsentResource } from "@/lib/fhir/resources";
import { assertRole } from "@/lib/auth/session";
import { consentInputSchema } from "@/lib/validators";
import { consentRepository } from "@/repositories/consentRepository";
import { fhirRepository } from "@/repositories/fhirRepository";
import { auditService } from "@/services/auditService";
import { fhirService } from "@/services/fhirService";
import { webhookService } from "@/services/webhookService";
import type { ConsentInput } from "@/types/api";
import type { RequestContext } from "@/types/domain";

export const consentService = {
  async listConsents(context: RequestContext) {
    return consentRepository.listByOrganization(context.organizationId);
  },

  async getConsent(context: RequestContext, id: string) {
    return consentRepository.getById(context.organizationId, id);
  },

  async createConsent(context: RequestContext, input: ConsentInput) {
    assertRole(context.role, ["admin", "provider"]);
    const payload = consentInputSchema.parse(input);
    const consentId = crypto.randomUUID();
    const storedFhir = await fhirService.createResource({
      organizationId: context.organizationId,
      resourceType: "Consent",
      resource: buildConsentResource(consentId, payload),
    });

    const consent = await consentRepository.create({
      id: consentId,
      organization_id: context.organizationId,
      patient_id: payload.patientId,
      status: payload.status,
      scope: payload.scope,
      categories: payload.categories,
      effective_from: new Date().toISOString(),
      effective_to: null,
      source: "portal",
      fhir_resource_id: storedFhir.id,
      created_by: context.userId,
    });

    await auditService.log({
      organizationId: context.organizationId,
      userId: context.userId,
      action: "consent.created",
      resourceType: "consent",
      resourceId: consent.id,
      metadata: { fhirResourceId: storedFhir.id },
    });

    await webhookService.emitEvent({
      organizationId: context.organizationId,
      event: "consent.created",
      resourceType: "consent",
      resourceId: consent.id,
      payload: {
        consentId: consent.id,
        patientId: consent.patient_id,
        fhirResourceId: storedFhir.id,
      },
    });

    return consent;
  },

  async updateConsent(context: RequestContext, id: string, input: ConsentInput) {
    assertRole(context.role, ["admin", "provider"]);
    const payload = consentInputSchema.parse(input);
    const existingConsent = await consentRepository.getById(context.organizationId, id);

    if (!existingConsent) {
      throw new Error("Consent not found");
    }

    const consent = await consentRepository.update(context.organizationId, id, {
      patient_id: payload.patientId,
      status: payload.status,
      scope: payload.scope,
      categories: payload.categories,
    });

    if (!consent) {
      throw new Error("Consent update failed");
    }

    if (existingConsent.fhir_resource_id) {
      const existingFhir = await fhirRepository.getById(
        context.organizationId,
        existingConsent.fhir_resource_id,
      );

      if (existingFhir) {
        await fhirRepository.update(context.organizationId, existingFhir.id, {
          resource: buildConsentResource(id, payload),
          version: existingFhir.version + 1,
        });
      }
    }

    await auditService.log({
      organizationId: context.organizationId,
      userId: context.userId,
      action: "consent.updated",
      resourceType: "consent",
      resourceId: consent.id,
      metadata: { fhirResourceId: existingConsent.fhir_resource_id },
    });

    await webhookService.emitEvent({
      organizationId: context.organizationId,
      event: "consent.updated",
      resourceType: "consent",
      resourceId: consent.id,
      payload: {
        consentId: consent.id,
        patientId: consent.patient_id,
        fhirResourceId: existingConsent.fhir_resource_id,
      },
    });

    return consent;
  },
};
