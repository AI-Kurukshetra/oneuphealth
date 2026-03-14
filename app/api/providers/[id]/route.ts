import { apiError, ok, routeError } from "@/lib/api";
import { getRequestContext } from "@/lib/auth/session";
import { providerService } from "@/services/providerService";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_: Request, { params }: Params) {
  try {
    const { id } = await params;
    const context = await getRequestContext();
    const provider = await providerService.getProvider(context, id);

    if (!provider) {
      return apiError("not_found", "Provider not found", 404);
    }

    return ok({ data: provider });
  } catch (error) {
    return routeError(error);
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const context = await getRequestContext();
    const provider = await providerService.updateProvider(context, id, await request.json());
    return ok({ data: provider });
  } catch (error) {
    return routeError(error);
  }
}
