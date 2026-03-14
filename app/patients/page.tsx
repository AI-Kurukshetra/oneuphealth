import Link from "next/link";

import { PatientTable } from "@/components/patients/PatientTable";
import { Card } from "@/components/ui/card";
import { requirePageContext } from "@/lib/auth/session";
import { patientService } from "@/services/patientService";

export default async function PatientsPage() {
  const context = await requirePageContext();
  const patients = await patientService.listPatients(context);

  return (
    <div className="space-y-6">
      <Card className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-accent">Patient Registry</p>
          <h2 className="mt-2 text-3xl font-semibold">Patient Data Aggregation</h2>
        </div>
        <Link
          href="/patients/create"
          className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white"
        >
          Create Patient
        </Link>
      </Card>
      <PatientTable patients={patients} />
    </div>
  );
}
