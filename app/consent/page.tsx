import { revalidatePath } from "next/cache";

import { ConsentManager } from "@/components/forms/ConsentManager";
import { requirePageContext } from "@/lib/auth/session";
import { consentService } from "@/services/consentService";

export default async function ConsentPage() {
  const context = await requirePageContext();
  const consents = await consentService.listConsents(context);

  async function createConsentAction(formData: FormData) {
    "use server";

    const actionContext = await requirePageContext();
    await consentService.createConsent(actionContext, {
      patientId: String(formData.get("patientId") ?? ""),
      status: String(formData.get("status") ?? ""),
      scope: String(formData.get("scope") ?? ""),
      categories: String(formData.get("categories") ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
    });

    revalidatePath("/consent");
  }

  return <ConsentManager consents={consents} action={createConsentAction} />;
}
