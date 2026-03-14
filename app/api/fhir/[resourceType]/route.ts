import { NextResponse } from "next/server";

import { apiError, routeError } from "@/lib/api";
import { getRequestContext } from "@/lib/auth/session";
import { isImplementedFhirResourceType } from "@/lib/fhir/registry";
import { fhirGatewayService } from "@/services/fhirGatewayService";

interface Params {
  params: Promise<{ resourceType: string }>;
}

export async function GET(request: Request, { params }: Params) {
  try {
    const { resourceType } = await params;

    if (!isImplementedFhirResourceType(resourceType)) {
      return apiError("not_implemented", `FHIR ${resourceType} is not implemented`, 501);
    }

    const context = await getRequestContext();
    const bundle = await fhirGatewayService.listResources(context, resourceType, request.url);
    return NextResponse.json(bundle);
  } catch (error) {
    return routeError(error);
  }
}

export async function POST(request: Request, { params }: Params) {
  try {
    const { resourceType } = await params;

    if (!isImplementedFhirResourceType(resourceType)) {
      return apiError("not_implemented", `FHIR ${resourceType} is not implemented`, 501);
    }

    const context = await getRequestContext();
    const resource = await request.json();
    const created = await fhirGatewayService.createResource(context, resourceType, resource);

    return NextResponse.json(created, {
      status: 201,
      headers:
        typeof created.id === "string"
          ? { Location: `/api/fhir/${resourceType}/${created.id}` }
          : undefined,
    });
  } catch (error) {
    return routeError(error);
  }
}
