import { auditRepository } from "@/repositories/auditRepository";

interface AuditInput {
  organizationId: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  metadata?: Record<string, unknown>;
}

export const auditService = {
  async log(input: AuditInput) {
    return auditRepository.create({
      id: crypto.randomUUID(),
      organization_id: input.organizationId,
      user_id: input.userId,
      action: input.action,
      resource_type: input.resourceType,
      resource_id: input.resourceId,
      metadata: input.metadata ?? null,
      timestamp: new Date().toISOString(),
    });
  },
};
