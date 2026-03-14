import { createHash, randomBytes } from "node:crypto";

import { assertRole } from "@/lib/auth/session";
import { apiKeyInputSchema } from "@/lib/validators";
import { apiKeyRepository } from "@/repositories/apiKeyRepository";
import { auditService } from "@/services/auditService";
import { analyticsService } from "@/services/analyticsService";
import { webhookService } from "@/services/webhookService";
import type { ApiKeyCreateInput } from "@/types/api";
import type { RequestContext } from "@/types/domain";

export const developerService = {
  async listApiKeys(context: RequestContext) {
    assertRole(context.role, ["admin", "developer"]);
    return apiKeyRepository.listByOrganization(context.organizationId);
  },

  async createApiKey(context: RequestContext, input: ApiKeyCreateInput) {
    assertRole(context.role, ["admin", "developer"]);
    const payload = apiKeyInputSchema.parse(input);
    const rawToken = `hp_live_${randomBytes(18).toString("hex")}`;
    const keyHash = createHash("sha256").update(rawToken).digest("hex");
    const keyPrefix = rawToken.slice(0, 11);

    const apiKey = await apiKeyRepository.create({
      id: crypto.randomUUID(),
      organization_id: context.organizationId,
      user_id: context.userId,
      name: payload.name,
      key_prefix: keyPrefix,
      key_hash: keyHash,
      permissions: payload.permissions,
      last_used_at: null,
      revoked_at: null,
    });

    await auditService.log({
      organizationId: context.organizationId,
      userId: context.userId,
      action: "api_key.created",
      resourceType: "api_key",
      resourceId: apiKey.id,
    });

    await webhookService.emitEvent({
      organizationId: context.organizationId,
      event: "api_key.created",
      resourceType: "api_key",
      resourceId: apiKey.id,
      payload: { apiKeyId: apiKey.id, permissions: payload.permissions },
    });

    return {
      apiKey,
      rawToken,
    };
  },

  async getUsageSummary(context: RequestContext) {
    assertRole(context.role, ["admin", "developer"]);
    return analyticsService.getDeveloperUsageSummary(context);
  },
};
