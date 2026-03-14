import { mockMetrics } from "@/lib/mock-data";
import { consentRepository } from "@/repositories/consentRepository";
import { fhirRepository } from "@/repositories/fhirRepository";
import { organizationRepository } from "@/repositories/organizationRepository";
import { patientRepository } from "@/repositories/patientRepository";
import { providerRepository } from "@/repositories/providerRepository";
import type { DashboardMetrics, RequestContext } from "@/types/domain";

export const analyticsService = {
  async getMetrics(organizationId: string): Promise<DashboardMetrics> {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return mockMetrics;
    }

    const [patients, providers, consents, fhirResources] = await Promise.all([
      patientRepository.listByOrganization(organizationId),
      providerRepository.listByOrganization(organizationId),
      consentRepository.listByOrganization(organizationId),
      fhirRepository.listByOrganization(organizationId),
    ]);

    const activeConsents = consents.filter((consent) => consent.status === "active").length;
    const consentOptInRate = patients.length === 0 ? 0 : activeConsents / patients.length;

    return {
      totalPatients: patients.length,
      totalProviders: providers.length,
      fhirRecordsCount: fhirResources.length,
      consentOptInRate,
    };
  },

  async getDeveloperUsageSummary(context: RequestContext) {
    const organization = await organizationRepository.getById(context.organizationId);

    return {
      organization: organization?.name ?? "Unknown Organization",
      totalRequests24h: 1284,
      successfulRequests24h: 1248,
      failedRequests24h: 36,
    };
  },
};
