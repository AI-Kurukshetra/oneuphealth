import { apiError, ok, routeError } from "@/lib/api";
import { getRequestContext } from "@/lib/auth/session";
import { patientService } from "@/services/patientService";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_: Request, { params }: Params) {
  try {
    const { id } = await params;
    const context = await getRequestContext();
    const patient = await patientService.getPatient(context, id);

    if (!patient) {
      return apiError("not_found", "Patient not found", 404);
    }

    return ok({ data: patient });
  } catch (error) {
    return routeError(error);
  }
}
