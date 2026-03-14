import { getRequestContext } from "@/lib/auth/session";
import { ok, routeError } from "@/lib/api";
import { providerService } from "@/services/providerService";

export async function GET() {
  try {
    const context = await getRequestContext();
    const providers = await providerService.listProviders(context);
    return ok({ data: providers });
  } catch (error) {
    return routeError(error);
  }
}

export async function POST(request: Request) {
  try {
    const context = await getRequestContext();
    const provider = await providerService.createProvider(context, await request.json());
    return ok({ data: provider }, { status: 201 });
  } catch (error) {
    return routeError(error);
  }
}
