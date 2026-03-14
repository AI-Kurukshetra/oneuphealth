import { Card } from "@/components/ui/card";
import { formatPercentage } from "@/lib/utils";
import type { DashboardMetrics } from "@/types/domain";

interface AnalyticsChartsProps {
  metrics: DashboardMetrics;
}

export function AnalyticsCharts({ metrics }: AnalyticsChartsProps) {
  const bars = [
    {
      label: "Patients",
      value: metrics.totalPatients,
      width: Math.min(100, metrics.totalPatients * 10),
    },
    {
      label: "Providers",
      value: metrics.totalProviders,
      width: Math.min(100, metrics.totalProviders * 18),
    },
    {
      label: "FHIR Records",
      value: metrics.fhirRecordsCount,
      width: Math.min(100, metrics.fhirRecordsCount / 2),
    },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h3 className="text-lg font-semibold">Interoperability Metrics</h3>
          <p className="mt-1 text-sm text-slate-500">
            Consent opt-in rate: {formatPercentage(metrics.consentOptInRate)}
          </p>
        </div>
      </div>
      <div className="mt-8 space-y-5">
        {bars.map((bar) => (
          <div key={bar.label}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span>{bar.label}</span>
              <span className="font-semibold">{bar.value.toLocaleString()}</span>
            </div>
            <div className="h-3 rounded-full bg-slate-100">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-accent to-ink"
                style={{ width: `${bar.width}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
