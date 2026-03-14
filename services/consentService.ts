import { buildConsentResource } from "@/lib/fhir/resources";
import { assertRole } from "@/lib/auth/session";
import { consentInputSchema } from "@/lib/validators";
import { consentRepository } from "@/repositories/consentRepository";
import { auditService } from "@/services/auditService";
import { fhirService } from "@/services/fhirService";
import { webhookService } from "@/services/webhookService";
import type { ConsentInput } from "@/types/api";
import type { RequestContext } from "@/types/domain";

export const consentService = {
  async listConsents(context: RequestContext) {
    return consentRepository.listByOrganization(context.organizationId);
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
};
