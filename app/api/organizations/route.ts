import { getRequestContext, assertRole } from "@/lib/auth/session";
import { apiError, ok, routeError } from "@/lib/api";
import { organizationService } from "@/services/organizationService";

export async function GET() {
  try {
    const context = await getRequestContext();
    assertRole(context.role, ["admin"]);
    const organizations = await organizationService.listOrganizations(context);
    return ok({ data: organizations });
  } catch (error) {
    return routeError(error);
  }
}

export async function POST(request: Request) {
  try {
    const context = await getRequestContext();
    const organization = await organizationService.createOrganization(context, await request.json());
    return ok({ data: organization }, { status: 201 });
  } catch (error) {
    return routeError(error);
  }
}
