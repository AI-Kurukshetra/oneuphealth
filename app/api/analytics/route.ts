import { apiError, ok, routeError } from "@/lib/api";
import { getRequestContext } from "@/lib/auth/session";
import { analyticsService } from "@/services/analyticsService";

export async function GET() {
  try {
    const context = await getRequestContext();
    const metrics = await analyticsService.getMetrics(context.organizationId);
    return ok({ data: metrics });
  } catch (error) {
    return routeError(error);
  }
}
