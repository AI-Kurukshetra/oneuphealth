import { getRequestContext, assertRole } from "@/lib/auth/session";
import { ok, routeError } from "@/lib/api";
import { organizationService } from "@/services/organizationService";

export async function GET() {
  try {
    const context = await getRequestContext();
    assertRole(context.role, ["admin"]);
    const organization = await organizationService.getOrganization(context.organizationId);

    return ok({
      data: {
        organization,
        capabilities: ["organizations", "users", "patients", "providers", "developer"],
      },
    });
  } catch (error) {
    return routeError(error);
  }
}
