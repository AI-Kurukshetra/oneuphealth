import { getRequestContext, assertRole } from "@/lib/auth/session";
import { ok, routeError } from "@/lib/api";
import { userRepository } from "@/repositories/userRepository";

export async function GET() {
  try {
    const context = await getRequestContext();
    assertRole(context.role, ["admin"]);
    const users = await userRepository.listByOrganization(context.organizationId);
    return ok({ data: users });
  } catch (error) {
    return routeError(error);
  }
}
