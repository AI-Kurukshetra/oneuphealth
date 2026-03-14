import { revalidatePath } from "next/cache";

import { ProviderForm } from "@/components/forms/ProviderForm";
import { ProviderTable } from "@/components/providers/ProviderTable";
import { Card } from "@/components/ui/card";
import { requirePageContext } from "@/lib/auth/session";
import { providerService } from "@/services/providerService";

export default async function ProvidersPage() {
  const context = await requirePageContext();
  const providers = await providerService.listProviders(context);

  async function createProviderAction(formData: FormData) {
    "use server";

    const actionContext = await requirePageContext();
    await providerService.createProvider(actionContext, {
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      specialty: String(formData.get("specialty") ?? ""),
      npi: String(formData.get("npi") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
    });

    revalidatePath("/providers");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <ProviderTable providers={providers} />
      <Card className="p-6">
        <p className="text-sm uppercase tracking-[0.24em] text-accent">Provider Directory</p>
        <h2 className="mt-2 text-2xl font-semibold">Add Provider</h2>
        <div className="mt-6">
          <ProviderForm action={createProviderAction} />
        </div>
      </Card>
    </div>
  );
}
