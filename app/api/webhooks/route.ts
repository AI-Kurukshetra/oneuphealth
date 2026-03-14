import { getRequestContext, assertRole } from "@/lib/auth/session";
import { ok, routeError } from "@/lib/api";
import { webhookInputSchema } from "@/lib/validators";
import { webhookService } from "@/services/webhookService";

export async function GET() {
  try {
    const context = await getRequestContext();
    const webhooks = await webhookService.listWebhooks(context.organizationId);
    return ok({ data: webhooks });
  } catch (error) {
    return routeError(error);
  }
}

export async function POST(request: Request) {
  try {
    const context = await getRequestContext();
    assertRole(context.role, ["admin", "developer"]);
    const payload = webhookInputSchema.parse(await request.json());
    const webhook = await webhookService.registerWebhook({
      organizationId: context.organizationId,
      userId: context.userId,
      name: payload.name,
      targetUrl: payload.targetUrl,
      events: payload.events,
    });

    return ok({ data: webhook }, { status: 201 });
  } catch (error) {
    return routeError(error);
  }
}
