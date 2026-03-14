import { getRequestContext } from "@/lib/auth/session";
import { ok, routeError } from "@/lib/api";
import { patientService } from "@/services/patientService";

export async function GET() {
  try {
    const context = await getRequestContext();
    const patients = await patientService.listPatients(context);
    return ok({ data: patients });
  } catch (error) {
    return routeError(error);
  }
}

export async function POST(request: Request) {
  try {
    const context = await getRequestContext();
    const patient = await patientService.createPatient(context, await request.json());
    return ok({ data: patient }, { status: 201 });
  } catch (error) {
    return routeError(error);
  }
}
