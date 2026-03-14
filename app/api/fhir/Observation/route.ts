import { ok, routeError } from "@/lib/api";
import { getRequestContext, assertRole } from "@/lib/auth/session";
import { auditService } from "@/services/auditService";
import { fhirService } from "@/services/fhirService";
import { webhookService } from "@/services/webhookService";

export async function GET() {
  try {
    const context = await getRequestContext();
    const resources = await fhirService.listResources(context.organizationId, "Observation");
    return ok({ data: resources });
  } catch (error) {
    return routeError(error);
  }
}

export async function POST(request: Request) {
  try {
    const context = await getRequestContext();
    assertRole(context.role, ["admin", "provider", "developer"]);
    const resource = await request.json();
    const created = await fhirService.createResource({
      organizationId: context.organizationId,
      resourceType: "Observation",
      resource,
      syncOperational: true,
      userId: context.userId,
    });

    await auditService.log({
      organizationId: context.organizationId,
      userId: context.userId,
      action: "fhir.resource.created",
      resourceType: "Observation",
      resourceId: created.id,
      metadata: { operationalResourceId: String(created.resource.id ?? "") },
    });

    await webhookService.emitEvent({
      organizationId: context.organizationId,
      event: "fhir.resource.created",
      resourceType: "Observation",
      resourceId: created.id,
      payload: created.resource,
    });

    return ok({ data: created }, { status: 201 });
  } catch (error) {
    return routeError(error);
  }
}
