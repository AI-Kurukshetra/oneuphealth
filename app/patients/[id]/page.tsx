import { notFound } from "next/navigation";

import { PatientProfile } from "@/components/patients/PatientProfile";
import { requirePageContext } from "@/lib/auth/session";
import { consentService } from "@/services/consentService";
import { fhirService } from "@/services/fhirService";
import { patientService } from "@/services/patientService";

interface PatientDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PatientDetailPage({ params }: PatientDetailPageProps) {
  const { id } = await params;
  const context = await requirePageContext();
  const patient = await patientService.getPatient(context, id);

  if (!patient) {
    notFound();
  }

  const [consents, fhirResources] = await Promise.all([
    consentService.listConsents(context),
    fhirService.listResources(context.organizationId),
  ]);

  return (
    <PatientProfile
      patient={patient}
      consents={consents.filter((consent) => consent.patient_id === patient.id)}
      fhirResources={fhirResources.filter(
        (resource) => String(resource.resource.id ?? "") === patient.id,
      )}
    />
  );
}
