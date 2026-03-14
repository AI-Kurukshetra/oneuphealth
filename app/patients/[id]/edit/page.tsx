import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { PatientForm } from "@/components/forms/PatientForm";
import { Card } from "@/components/ui/card";
import { requirePageContext } from "@/lib/auth/session";
import { patientService } from "@/services/patientService";

interface EditPatientPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPatientPage({ params }: EditPatientPageProps) {
  const { id } = await params;
  const context = await requirePageContext();
  const patient = await patientService.getPatient(context, id);

  if (!patient) {
    redirect("/patients");
  }

  async function updatePatientAction(formData: FormData) {
    "use server";

    const actionContext = await requirePageContext();
    await patientService.updatePatient(actionContext, id, {
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      birthDate: String(formData.get("birthDate") ?? ""),
      gender: String(formData.get("gender") ?? ""),
      mrn: String(formData.get("mrn") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
    });

    revalidatePath("/patients");
    revalidatePath(`/patients/${id}`);
    revalidatePath(`/patients/${id}/edit`);
    redirect(`/patients/${id}`);
  }

  return (
    <Card className="p-6">
      <p className="text-sm uppercase tracking-[0.24em] text-accent">Edit Patient</p>
      <h2 className="mt-2 text-3xl font-semibold">Update Patient Record</h2>
      <p className="mt-3 max-w-2xl text-sm text-slate-600">
        This action updates the operational patient record, keeps the canonical FHIR Patient
        resource in sync, writes an audit log, and emits webhook events.
      </p>
      <div className="mt-8">
        <PatientForm action={updatePatientAction} patient={patient} submitLabel="Save Changes" />
      </div>
    </Card>
  );
}
