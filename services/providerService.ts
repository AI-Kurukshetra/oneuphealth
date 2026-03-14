import { assertRole } from "@/lib/auth/session";
import { providerInputSchema } from "@/lib/validators";
import { providerRepository } from "@/repositories/providerRepository";
import { auditService } from "@/services/auditService";
import { webhookService } from "@/services/webhookService";
import type { ProviderInput } from "@/types/api";
import type { RequestContext } from "@/types/domain";

export const providerService = {
  async listProviders(context: RequestContext) {
    return providerRepository.listByOrganization(context.organizationId);
  },

  async createProvider(context: RequestContext, input: ProviderInput) {
    assertRole(context.role, ["admin", "provider"]);
    const payload = providerInputSchema.parse(input);
    const providerId = crypto.randomUUID();

    const provider = await providerRepository.create({
      id: providerId,
      organization_id: context.organizationId,
      npi: payload.npi ?? null,
      first_name: payload.firstName,
      last_name: payload.lastName,
      specialty: payload.specialty ?? null,
      email: payload.email || null,
      phone: payload.phone ?? null,
      fhir_resource_id: null,
    });

    await auditService.log({
      organizationId: context.organizationId,
      userId: context.userId,
      action: "provider.created",
      resourceType: "provider",
      resourceId: provider.id,
    });

    await webhookService.emitEvent({
      organizationId: context.organizationId,
      event: "provider.created",
      resourceType: "provider",
      resourceId: provider.id,
      payload: { providerId: provider.id },
    });

    return provider;
  },
};
