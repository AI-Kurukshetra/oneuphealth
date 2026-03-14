import { Card } from "@/components/ui/card";
import { formatPercentage } from "@/lib/utils";
import type { DashboardMetrics } from "@/types/domain";

interface DashboardStatsProps {
  metrics: DashboardMetrics;
}

export function DashboardStats({ metrics }: DashboardStatsProps) {
  const items = [
    { label: "Total Patients", value: metrics.totalPatients.toLocaleString() },
    { label: "Total Providers", value: metrics.totalProviders.toLocaleString() },
    { label: "FHIR Records", value: metrics.fhirRecordsCount.toLocaleString() },
    { label: "Consent Opt-In", value: formatPercentage(metrics.consentOptInRate) },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="p-6">
          <p className="text-sm text-slate-500">{item.label}</p>
          <p className="mt-3 text-3xl font-semibold">{item.value}</p>
        </Card>
      ))}
    </div>
  );
}
