import { apiError, ok, routeError } from "@/lib/api";
import { getRequestContext } from "@/lib/auth/session";
import { consentService } from "@/services/consentService";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_: Request, { params }: Params) {
  try {
    const { id } = await params;
    const context = await getRequestContext();
    const consent = await consentService.getConsent(context, id);

    if (!consent) {
      return apiError("not_found", "Consent not found", 404);
    }

    return ok({ data: consent });
  } catch (error) {
    return routeError(error);
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const context = await getRequestContext();
    const consent = await consentService.updateConsent(context, id, await request.json());
    return ok({ data: consent });
  } catch (error) {
    return routeError(error);
  }
}
