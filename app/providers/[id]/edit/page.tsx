import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ProviderForm } from "@/components/forms/ProviderForm";
import { Card } from "@/components/ui/card";
import { requirePageContext } from "@/lib/auth/session";
import { providerService } from "@/services/providerService";

interface EditProviderPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProviderPage({ params }: EditProviderPageProps) {
  const { id } = await params;
  const context = await requirePageContext();
  const provider = await providerService.getProvider(context, id);

  if (!provider) {
    redirect("/providers");
  }

  async function updateProviderAction(formData: FormData) {
    "use server";

    const actionContext = await requirePageContext();
    await providerService.updateProvider(actionContext, id, {
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      specialty: String(formData.get("specialty") ?? ""),
      npi: String(formData.get("npi") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
    });

    revalidatePath("/providers");
    revalidatePath(`/providers/${id}/edit`);
    redirect("/providers");
  }

  return (
    <Card className="p-6">
      <p className="text-sm uppercase tracking-[0.24em] text-accent">Edit Provider</p>
      <h2 className="mt-2 text-3xl font-semibold">Update Provider Record</h2>
      <p className="mt-3 max-w-2xl text-sm text-slate-600">
        This action updates the operational provider record, writes an audit log, and emits
        webhook events.
      </p>
      <div className="mt-8">
        <ProviderForm action={updateProviderAction} provider={provider} submitLabel="Save Changes" />
      </div>
    </Card>
  );
}
