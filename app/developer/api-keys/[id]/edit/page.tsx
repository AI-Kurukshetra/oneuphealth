import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { requirePageContext } from "@/lib/auth/session";
import { developerService } from "@/services/developerService";

const permissionOptions = ["fhir.read", "fhir.write", "webhooks.read", "webhooks.write", "analytics.read"];

interface EditApiKeyPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditApiKeyPage({ params }: EditApiKeyPageProps) {
  const { id } = await params;
  const context = await requirePageContext();
  const apiKey = await developerService.getApiKey(context, id);

  if (!apiKey) {
    redirect("/developer");
  }

  async function updateApiKeyAction(formData: FormData) {
    "use server";

    const actionContext = await requirePageContext();
    await developerService.updateApiKey(actionContext, id, {
      name: String(formData.get("name") ?? ""),
      permissions: formData
        .getAll("permissions")
        .map((value) => String(value).trim())
        .filter(Boolean),
    });

    revalidatePath("/developer");
    revalidatePath(`/developer/api-keys/${id}/edit`);
    redirect("/developer");
  }

  return (
    <Card className="p-6">
      <p className="text-sm uppercase tracking-[0.24em] text-accent">Edit API Key</p>
      <h2 className="mt-2 text-3xl font-semibold">Update API Key Metadata</h2>
      <p className="mt-3 max-w-2xl text-sm text-slate-600">
        This action updates the API key name and permissions only. The raw token, prefix, and
        hash are not changed.
      </p>
      <form action={updateApiKeyAction} className="mt-8 space-y-4">
        <Input name="name" defaultValue={apiKey.name} placeholder="Integration name" required />
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink" htmlFor="permissions">
            Permissions
          </label>
          <select
            id="permissions"
            name="permissions"
            multiple
            defaultValue={apiKey.permissions}
            className="min-h-36 w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink"
          >
            {permissionOptions.map((permission) => (
              <option key={permission} value={permission}>
                {permission}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500">Hold Ctrl or Cmd to select multiple permissions.</p>
        </div>
        <div className="rounded-2xl border border-line bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Key prefix: <span className="font-semibold text-ink">{apiKey.key_prefix}...</span>
        </div>
        <Button type="submit">Save Changes</Button>
      </form>
    </Card>
  );
}
