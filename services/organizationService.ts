import { organizationRepository } from "@/repositories/organizationRepository";
import { slugify } from "@/lib/utils";
import { organizationInputSchema } from "@/lib/validators";
import { assertRole } from "@/lib/auth/session";
import type { Organization, RequestContext } from "@/types/domain";

export const organizationService = {
  async listOrganizations(context: RequestContext) {
    assertRole(context.role, ["admin"]);
    return organizationRepository.listByIds([context.organizationId]);
  },

  async getOrganization(organizationId: string): Promise<Organization | null> {
    return organizationRepository.getById(organizationId);
  },

  async createOrganization(context: RequestContext, input: { name: string }) {
    assertRole(context.role, ["admin"]);
    const payload = organizationInputSchema.parse(input);

    return organizationRepository.create({
      id: crypto.randomUUID(),
      name: payload.name,
      slug: slugify(payload.name),
      status: "active",
      settings: { fhirVersion: "R4" },
    });
  },
};
