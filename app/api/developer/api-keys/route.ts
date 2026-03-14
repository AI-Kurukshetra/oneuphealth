import { getRequestContext } from "@/lib/auth/session";
import { ok, routeError } from "@/lib/api";
import { developerService } from "@/services/developerService";

export async function GET() {
  try {
    const context = await getRequestContext();
    const apiKeys = await developerService.listApiKeys(context);
    return ok({ data: apiKeys });
  } catch (error) {
    return routeError(error);
  }
}

export async function POST(request: Request) {
  try {
    const context = await getRequestContext();
    const result = await developerService.createApiKey(context, await request.json());
    return ok({ data: result }, { status: 201 });
  } catch (error) {
    return routeError(error);
  }
}
