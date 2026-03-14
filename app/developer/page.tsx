import { revalidatePath } from "next/cache";

import { ApiKeyManager } from "@/components/dashboard/ApiKeyManager";
import { Card } from "@/components/ui/card";
import { requirePageContext } from "@/lib/auth/session";
import { developerService } from "@/services/developerService";

export default async function DeveloperPage() {
  const context = await requirePageContext();
  const [apiKeys, usage] = await Promise.all([
    developerService.listApiKeys(context),
    developerService.getUsageSummary(context),
  ]);

  async function createApiKeyAction(formData: FormData) {
    "use server";

    const actionContext = await requirePageContext();
    await developerService.createApiKey(actionContext, {
      name: String(formData.get("name") ?? ""),
      permissions: String(formData.get("permissions") ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
    });

    revalidatePath("/developer");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-6">
        <ApiKeyManager apiKeys={apiKeys} />
        <Card className="p-6">
          <h3 className="text-lg font-semibold">FHIR Endpoint Tester</h3>
          <div className="mt-4 space-y-3 rounded-3xl bg-slate-950 p-5 text-sm text-slate-100">
            <pre>GET /api/fhir/Patient/:id</pre>
            <pre>POST /api/fhir/Patient</pre>
            <pre>GET /api/fhir/Observation</pre>
            <pre>POST /api/fhir/Encounter</pre>
          </div>
        </Card>
      </div>
      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold">Generate API Key</h3>
          <form action={createApiKeyAction} className="mt-5 space-y-4">
            <input
              name="name"
              className="w-full rounded-2xl border border-line px-4 py-3"
              placeholder="Integration name"
              required
            />
            <input
              name="permissions"
              className="w-full rounded-2xl border border-line px-4 py-3"
              placeholder="fhir.read,fhir.write,webhooks.read"
            />
            <button
              type="submit"
              className="rounded-full bg-ink px-4 py-3 text-sm font-semibold text-white"
            >
              Create Key
            </button>
          </form>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold">API Usage</h3>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Total requests (24h)</span>
              <strong>{usage.totalRequests24h}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Successful requests</span>
              <strong>{usage.successfulRequests24h}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Failed requests</span>
              <strong>{usage.failedRequests24h}</strong>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
