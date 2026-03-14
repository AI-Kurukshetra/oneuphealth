import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { requirePageContext } from "@/lib/auth/session";
import { consentService } from "@/services/consentService";

interface EditConsentPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditConsentPage({ params }: EditConsentPageProps) {
  const { id } = await params;
  const context = await requirePageContext();
  const consent = await consentService.getConsent(context, id);

  if (!consent) {
    redirect("/consent");
  }

  async function updateConsentAction(formData: FormData) {
    "use server";

    const actionContext = await requirePageContext();
    await consentService.updateConsent(actionContext, id, {
      patientId: String(formData.get("patientId") ?? ""),
      status: String(formData.get("status") ?? ""),
      scope: String(formData.get("scope") ?? ""),
      categories: String(formData.get("categories") ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
    });

    revalidatePath("/consent");
    revalidatePath(`/consent/${id}/edit`);
    redirect("/consent");
  }

  return (
    <Card className="p-6">
      <p className="text-sm uppercase tracking-[0.24em] text-accent">Edit Consent</p>
      <h2 className="mt-2 text-3xl font-semibold">Update Consent Record</h2>
      <p className="mt-3 max-w-2xl text-sm text-slate-600">
        This action updates the operational consent record, keeps the canonical FHIR Consent
        resource in sync, writes an audit log, and emits webhook events.
      </p>
      <form action={updateConsentAction} className="mt-8 space-y-4">
        <Input name="patientId" defaultValue={consent.patient_id} placeholder="Patient UUID" required />
        <Input name="status" defaultValue={consent.status} placeholder="active" required />
        <Input name="scope" defaultValue={consent.scope} placeholder="data-sharing" required />
        <Input
          name="categories"
          defaultValue={consent.categories.join(",")}
          placeholder="treatment,payment"
          required
        />
        <Button type="submit">Save Changes</Button>
      </form>
    </Card>
  );
}
