import { auditService } from "@/services/auditService";
import { webhookRepository } from "@/repositories/webhookRepository";

interface WebhookDeliveryResult {
  webhookId: string;
  event: string;
  delivered: boolean;
  statusCode?: number;
  targetUrl: string;
  resourceType: string;
  resourceId: string;
  error?: string;
}

export const webhookService = {
  async listWebhooks(organizationId: string) {
    return webhookRepository.listByOrganization(organizationId);
  },

  async registerWebhook(input: {
    organizationId: string;
    userId?: string;
    name: string;
    targetUrl: string;
    events: string[];
  }) {
    const webhook = await webhookRepository.create({
      id: crypto.randomUUID(),
      organization_id: input.organizationId,
      name: input.name,
      target_url: input.targetUrl,
      events: input.events,
      secret_hash: null,
      status: "active",
      last_triggered_at: null,
    });

    if (input.userId) {
      await auditService.log({
        organizationId: input.organizationId,
        userId: input.userId,
        action: "webhook.created",
        resourceType: "webhook",
        resourceId: webhook.id,
        metadata: { events: input.events, targetUrl: input.targetUrl },
      });
    }

    return webhook;
  },

  async emitEvent(input: {
    organizationId: string;
    event: string;
    resourceType: string;
    resourceId: string;
    payload?: Record<string, unknown>;
  }): Promise<WebhookDeliveryResult[]> {
    const subscriptions = await webhookRepository.listByOrganization(input.organizationId);
    const activeSubscriptions = subscriptions.filter(
      (subscription) => subscription.status === "active" && subscription.events.includes(input.event),
    );

    const deliveredAt = new Date().toISOString();

    return Promise.all(
      activeSubscriptions.map(async (subscription) => {
        const requestPayload = {
          event: input.event,
          organizationId: input.organizationId,
          resourceType: input.resourceType,
          resourceId: input.resourceId,
          deliveredAt,
          payload: input.payload ?? null,
        };

        try {
          const response = await fetch(subscription.target_url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestPayload),
            signal: AbortSignal.timeout(5000),
          });

          await webhookRepository.updateLastTriggeredAt(input.organizationId, subscription.id, deliveredAt);

          return {
            webhookId: subscription.id,
            event: input.event,
            delivered: response.ok,
            statusCode: response.status,
            targetUrl: subscription.target_url,
            resourceType: input.resourceType,
            resourceId: input.resourceId,
            error: response.ok ? undefined : `Webhook returned ${response.status}`,
          };
        } catch (error) {
          return {
            webhookId: subscription.id,
            event: input.event,
            delivered: false,
            targetUrl: subscription.target_url,
            resourceType: input.resourceType,
            resourceId: input.resourceId,
            error: error instanceof Error ? error.message : "Unknown webhook delivery error",
          };
        }
      }),
    );
  },
};
