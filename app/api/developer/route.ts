import { getRequestContext, assertRole } from "@/lib/auth/session";
import { apiError, ok } from "@/lib/api";

export async function GET() {
  try {
    const context = await getRequestContext();
    assertRole(context.role, ["admin", "developer"]);
    return ok({
      data: {
        routes: ["/api/developer/api-keys", "/api/developer/usage"],
      },
    });
  } catch (error) {
    return apiError("forbidden", (error as Error).message, 403);
  }
}
