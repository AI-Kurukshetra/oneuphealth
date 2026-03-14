import { getRequestContext } from "@/lib/auth/session";
import { ok, routeError } from "@/lib/api";
import { consentService } from "@/services/consentService";

export async function GET() {
  try {
    const context = await getRequestContext();
    const consents = await consentService.listConsents(context);
    return ok({ data: consents });
  } catch (error) {
    return routeError(error);
  }
}

export async function POST(request: Request) {
  try {
    const context = await getRequestContext();
    const consent = await consentService.createConsent(context, await request.json());
    return ok({ data: consent }, { status: 201 });
  } catch (error) {
    return routeError(error);
  }
}
