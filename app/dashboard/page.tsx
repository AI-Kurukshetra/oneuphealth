import { ApiKeyManager } from "@/components/dashboard/ApiKeyManager";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { WebhookManager } from "@/components/dashboard/WebhookManager";
import { AnalyticsCharts } from "@/components/charts/AnalyticsCharts";
import { PatientTable } from "@/components/patients/PatientTable";
import { Card } from "@/components/ui/card";
import { requirePageContext } from "@/lib/auth/session";
import { apiKeyRepository } from "@/repositories/apiKeyRepository";
import { dashboardService } from "@/services/dashboardService";

export default async function DashboardPage() {
  const context = await requirePageContext();
  const payload = await dashboardService.getDashboardPayload(context.organizationId);
  const apiKeys = await apiKeyRepository.listByOrganization(context.organizationId);

  return (
    <>
      <Card className="bg-gradient-to-r from-ink to-accent p-8 text-white">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-100">
          {payload.organization.name}
        </p>
        <h2 className="mt-3 text-4xl font-semibold">Tenant Operations Dashboard</h2>
        <p className="mt-3 max-w-2xl text-sm text-cyan-50">
          Monitor patient aggregation, FHIR growth, consents, developer activity, and webhook
          readiness from a single operational view.
        </p>
      </Card>
      <DashboardStats metrics={payload.metrics} />
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <AnalyticsCharts metrics={payload.metrics} />
        <WebhookManager webhooks={payload.webhooks} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <PatientTable patients={payload.patients.slice(0, 5)} />
        <ApiKeyManager apiKeys={apiKeys} />
      </div>
    </>
  );
}
