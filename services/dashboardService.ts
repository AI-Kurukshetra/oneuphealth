import { apiKeyRepository } from "@/repositories/apiKeyRepository";
import { consentRepository } from "@/repositories/consentRepository";
import { fhirRepository } from "@/repositories/fhirRepository";
import { organizationRepository } from "@/repositories/organizationRepository";
import { patientRepository } from "@/repositories/patientRepository";
import { providerRepository } from "@/repositories/providerRepository";
import { webhookRepository } from "@/repositories/webhookRepository";
import { analyticsService } from "@/services/analyticsService";
import type { DashboardPayload } from "@/types/api";

export const dashboardService = {
  async getDashboardPayload(organizationId: string): Promise<DashboardPayload> {
    const [organization, patients, providers, consents, recentFhirResources, webhooks, metrics] =
      await Promise.all([
        organizationRepository.getById(organizationId),
        patientRepository.listByOrganization(organizationId),
        providerRepository.listByOrganization(organizationId),
        consentRepository.listByOrganization(organizationId),
        fhirRepository.listByOrganization(organizationId),
        webhookRepository.listByOrganization(organizationId),
        analyticsService.getMetrics(organizationId),
      ]);

    await apiKeyRepository.listByOrganization(organizationId);

    if (!organization) {
      throw new Error("Organization not found");
    }

    return {
      organization,
      metrics,
      patients,
      providers,
      consents,
      recentFhirResources: recentFhirResources.slice(0, 5),
      webhooks,
    };
  },
};
