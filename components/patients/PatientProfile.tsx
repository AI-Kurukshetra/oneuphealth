import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { Consent, FhirResourceRecord, Patient } from "@/types/domain";

interface PatientProfileProps {
  patient: Patient;
  consents: Consent[];
  fhirResources: FhirResourceRecord[];
}

export function PatientProfile({
  patient,
  consents,
  fhirResources,
}: PatientProfileProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold">
          {patient.first_name} {patient.last_name}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Birth Date</p>
            <p className="font-medium">{formatDate(patient.birth_date)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Gender</p>
            <p className="font-medium capitalize">{patient.gender ?? "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">MRN</p>
            <p className="font-medium">{patient.mrn ?? "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Contact</p>
            <p className="font-medium">{patient.email ?? patient.phone ?? "N/A"}</p>
          </div>
        </div>
      </Card>
      <Card className="p-6">
        <h3 className="text-lg font-semibold">Consent and FHIR Summary</h3>
        <p className="mt-4 text-sm text-slate-500">
          Consents: {consents.length} | FHIR resources: {fhirResources.length}
        </p>
      </Card>
    </div>
  );
}
