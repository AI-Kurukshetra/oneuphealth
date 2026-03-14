import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { FhirEndpointTester } from "@/components/developer/FhirEndpointTester";
import { ApiKeyManager } from "@/components/dashboard/ApiKeyManager";
import { Card } from "@/components/ui/card";
import { requirePageContext } from "@/lib/auth/session";
import { developerService } from "@/services/developerService";

const permissionOptions = ["fhir.read", "fhir.write", "webhooks.read", "webhooks.write", "analytics.read"];
const latestApiKeyCookie = "latest_api_key";

function parseLatestApiKeyCookie(value: string | undefined) {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as {
      name?: string;
      rawToken?: string;
      keyPrefix?: string;
    };

    if (!parsed.rawToken || !parsed.name) {
      return null;
    }

    return {
      name: parsed.name,
      rawToken: parsed.rawToken,
      keyPrefix: parsed.keyPrefix ?? null,
    };
  } catch {
    return null;
  }
}

export default async function DeveloperPage() {
  const context = await requirePageContext();
  const cookieStore = await cookies();
  const latestApiKey = parseLatestApiKeyCookie(cookieStore.get(latestApiKeyCookie)?.value);
  const [apiKeys, usage] = await Promise.all([
    developerService.listApiKeys(context),
    developerService.getUsageSummary(context),
  ]);

  async function createApiKeyAction(formData: FormData) {
    "use server";

    const actionContext = await requirePageContext();
    const result = await developerService.createApiKey(actionContext, {
      name: String(formData.get("name") ?? ""),
      permissions: formData
        .getAll("permissions")
        .map((value) => String(value).trim())
        .filter(Boolean),
    });

    const actionCookies = await cookies();
    actionCookies.set(
      latestApiKeyCookie,
      JSON.stringify({
        name: result.apiKey.name,
        keyPrefix: result.apiKey.key_prefix,
        rawToken: result.rawToken,
      }),
      {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 300,
        path: "/developer",
      },
    );

    revalidatePath("/developer");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-6">
        {latestApiKey ? (
          <Card className="border-emerald-200 bg-emerald-50/70 p-6 lg:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Latest API Key
                </p>
                <h3 className="mt-2 text-lg font-semibold text-ink">{latestApiKey.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  This full token is shown only after creation. Existing keys can only display their prefix.
                </p>
              </div>
              {latestApiKey.keyPrefix ? (
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700">
                  {latestApiKey.keyPrefix}...
                </span>
              ) : null}
            </div>
            <div className="mt-5 rounded-2xl bg-slate-950 p-4">
              <p className="font-mono text-sm break-all text-slate-100">{latestApiKey.rawToken}</p>
            </div>
          </Card>
        ) : null}
        <ApiKeyManager apiKeys={apiKeys} />
        <Card className="p-6 lg:p-7">
          <FhirEndpointTester />
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink" htmlFor="permissions">
                Permissions
              </label>
              <select
                id="permissions"
                name="permissions"
                multiple
                defaultValue={["fhir.read", "fhir.write"]}
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
