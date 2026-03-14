import { getRequestContext } from "@/lib/auth/session";
import { ok, routeError } from "@/lib/api";
import { developerService } from "@/services/developerService";

export async function GET() {
  try {
    const context = await getRequestContext();
    const usage = await developerService.getUsageSummary(context);
    return ok({ data: usage });
  } catch (error) {
    return routeError(error);
  }
}
