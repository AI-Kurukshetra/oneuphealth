import { assertRole } from "@/lib/auth/session";
import { buildFhirBundle } from "@/lib/fhir/bundle";
import {
  getFhirResourceSupport,
  type ImplementedFhirResourceType,
} from "@/lib/fhir/registry";
import { fhirRepository } from "@/repositories/fhirRepository";
import { auditService } from "@/services/auditService";
import { fhirService } from "@/services/fhirService";
import { webhookService } from "@/services/webhookService";
import type { RequestContext } from "@/types/domain";

export const fhirGatewayService = {
  async listResources(
    context: RequestContext,
    resourceType: ImplementedFhirResourceType,
    requestUrl?: string,
  ) {
    const records = await fhirService.listResources(context.organizationId, resourceType);
    return buildFhirBundle(records, requestUrl);
  },

  async getResource(
    context: RequestContext,
    resourceType: ImplementedFhirResourceType,
    resourceId: string,
  ) {
    const record = await fhirRepository.getByResourceId(
      context.organizationId,
      resourceType,
      resourceId,
    );

    return record?.resource ?? null;
  },

  async createResource(
    context: RequestContext,
    resourceType: ImplementedFhirResourceType,
    resource: Record<string, unknown>,
  ) {
    const support = getFhirResourceSupport(resourceType);

    if (!support) {
      throw new Error("Unsupported FHIR resource type");
    }

    assertRole(context.role, support.mutationRoles);

    const created = await fhirService.createResource({
      organizationId: context.organizationId,
      resourceType,
      resource,
      syncOperational: true,
      userId: context.userId,
    });

    await auditService.log({
      organizationId: context.organizationId,
      userId: context.userId,
      action: "fhir.resource.created",
      resourceType,
      resourceId: created.id,
      metadata: { operationalResourceId: String(created.resource.id ?? "") },
    });

    await webhookService.emitEvent({
      organizationId: context.organizationId,
      event: "fhir.resource.created",
      resourceType,
      resourceId: created.id,
      payload: created.resource,
    });

    return created.resource;
  },

  async updateResource(
    context: RequestContext,
    resourceType: ImplementedFhirResourceType,
    resourceId: string,
    resource: Record<string, unknown>,
  ) {
    const support = getFhirResourceSupport(resourceType);

    if (!support) {
      throw new Error("Unsupported FHIR resource type");
    }

    assertRole(context.role, support.mutationRoles);

    const updated = await fhirService.updateResource({
      organizationId: context.organizationId,
      resourceType,
      resourceId,
      resource,
      syncOperational: true,
      userId: context.userId,
    });

    await auditService.log({
      organizationId: context.organizationId,
      userId: context.userId,
      action: "fhir.resource.updated",
      resourceType,
      resourceId: updated.id,
      metadata: { operationalResourceId: String(updated.resource.id ?? "") },
    });

    await webhookService.emitEvent({
      organizationId: context.organizationId,
      event: "fhir.resource.updated",
      resourceType,
      resourceId: updated.id,
      payload: updated.resource,
    });

    return updated.resource;
  },

  async deleteResource(
    context: RequestContext,
    resourceType: ImplementedFhirResourceType,
    resourceId: string,
  ) {
    const support = getFhirResourceSupport(resourceType);

    if (!support) {
      throw new Error("Unsupported FHIR resource type");
    }

    assertRole(context.role, support.mutationRoles);

    const deleted = await fhirService.deleteResource({
      organizationId: context.organizationId,
      resourceType,
      resourceId,
      syncOperational: true,
    });

    if (!deleted) {
      return null;
    }

    await auditService.log({
      organizationId: context.organizationId,
      userId: context.userId,
      action: "fhir.resource.deleted",
      resourceType,
      resourceId: deleted.id,
      metadata: { operationalResourceId: String(deleted.resource.id ?? "") },
    });

    await webhookService.emitEvent({
      organizationId: context.organizationId,
      event: "fhir.resource.deleted",
      resourceType,
      resourceId: deleted.id,
      payload: deleted.resource,
    });

    return deleted.resource;
  },
};
