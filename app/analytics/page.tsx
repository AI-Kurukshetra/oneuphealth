import { AnalyticsCharts } from "@/components/charts/AnalyticsCharts";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { Card } from "@/components/ui/card";
import { requirePageContext } from "@/lib/auth/session";
import { analyticsService } from "@/services/analyticsService";

export default async function AnalyticsPage() {
  const context = await requirePageContext();
  const metrics = await analyticsService.getMetrics(context.organizationId);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <p className="text-sm uppercase tracking-[0.24em] text-accent">Healthcare Analytics</p>
        <h2 className="mt-2 text-3xl font-semibold">Operational Interoperability Metrics</h2>
      </Card>
      <DashboardStats metrics={metrics} />
      <AnalyticsCharts metrics={metrics} />
    </div>
  );
}
