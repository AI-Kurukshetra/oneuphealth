import { NextResponse } from "next/server";

import { apiError, routeError } from "@/lib/api";
import { getRequestContext } from "@/lib/auth/session";
import { isImplementedFhirResourceType } from "@/lib/fhir/registry";
import { fhirGatewayService } from "@/services/fhirGatewayService";

interface Params {
  params: Promise<{ resourceType: string; id: string }>;
}

export async function GET(_: Request, { params }: Params) {
  try {
    const { resourceType, id } = await params;

    if (!isImplementedFhirResourceType(resourceType)) {
      return apiError("not_implemented", `FHIR ${resourceType} is not implemented`, 501);
    }

    const context = await getRequestContext();
    const resource = await fhirGatewayService.getResource(context, resourceType, id);

    if (!resource) {
      return apiError("not_found", `FHIR ${resourceType}/${id} not found`, 404);
    }

    return NextResponse.json(resource);
  } catch (error) {
    return routeError(error);
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { resourceType, id } = await params;

    if (!isImplementedFhirResourceType(resourceType)) {
      return apiError("not_implemented", `FHIR ${resourceType} is not implemented`, 501);
    }

    const context = await getRequestContext();
    const resource = await request.json();
    const updated = await fhirGatewayService.updateResource(context, resourceType, id, resource);

    return NextResponse.json(updated);
  } catch (error) {
    return routeError(error);
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const { resourceType, id } = await params;

    if (!isImplementedFhirResourceType(resourceType)) {
      return apiError("not_implemented", `FHIR ${resourceType} is not implemented`, 501);
    }

    const context = await getRequestContext();
    const deleted = await fhirGatewayService.deleteResource(context, resourceType, id);

    if (!deleted) {
      return apiError("not_found", `FHIR ${resourceType}/${id} not found`, 404);
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    return routeError(error);
  }
}
