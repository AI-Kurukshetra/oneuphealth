import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { PatientForm } from "@/components/forms/PatientForm";
import { Card } from "@/components/ui/card";
import { requirePageContext } from "@/lib/auth/session";
import { patientService } from "@/services/patientService";

export default async function CreatePatientPage() {
  async function createPatientAction(formData: FormData) {
    "use server";

    const context = await requirePageContext();
    await patientService.createPatient(context, {
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      birthDate: String(formData.get("birthDate") ?? ""),
      gender: String(formData.get("gender") ?? ""),
      mrn: String(formData.get("mrn") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
    });

    revalidatePath("/patients");
    redirect("/patients");
  }

  return (
    <Card className="p-6">
      <p className="text-sm uppercase tracking-[0.24em] text-accent">New Patient</p>
      <h2 className="mt-2 text-3xl font-semibold">Create Patient Record</h2>
      <p className="mt-3 max-w-2xl text-sm text-slate-600">
        This action creates the operational patient row, stores the canonical FHIR Patient
        resource, writes an audit log, and emits webhook events.
      </p>
      <div className="mt-8">
        <PatientForm action={createPatientAction} />
      </div>
    </Card>
  );
}
