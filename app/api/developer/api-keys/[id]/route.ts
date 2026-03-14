import { apiError, ok, routeError } from "@/lib/api";
import { getRequestContext } from "@/lib/auth/session";
import { developerService } from "@/services/developerService";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_: Request, { params }: Params) {
  try {
    const { id } = await params;
    const context = await getRequestContext();
    const apiKey = await developerService.getApiKey(context, id);

    if (!apiKey) {
      return apiError("not_found", "API key not found", 404);
    }

    return ok({ data: apiKey });
  } catch (error) {
    return routeError(error);
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const context = await getRequestContext();
    const apiKey = await developerService.updateApiKey(context, id, await request.json());
    return ok({ data: apiKey });
  } catch (error) {
    return routeError(error);
  }
}
