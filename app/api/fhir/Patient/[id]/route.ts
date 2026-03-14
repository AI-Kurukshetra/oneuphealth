import { apiError, ok, routeError } from "@/lib/api";
import { getRequestContext } from "@/lib/auth/session";
import { fhirService } from "@/services/fhirService";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_: Request, { params }: Params) {
  try {
    const { id } = await params;
    const context = await getRequestContext();
    const resource = await fhirService.getResource(context.organizationId, id);

    if (!resource || resource.resource_type !== "Patient") {
      return apiError("not_found", "FHIR Patient resource not found", 404);
    }

    return ok({ data: resource });
  } catch (error) {
    return routeError(error);
  }
}
