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
    <Card className="p-6 lg:p-7">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h3 className="text-lg font-semibold text-ink">Interoperability Metrics</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Consent opt-in rate: {formatPercentage(metrics.consentOptInRate)}
          </p>
        </div>
      </div>
      <div className="mt-8 space-y-6">
        {bars.map((bar) => (
          <div key={bar.label}>
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-slate-600">{bar.label}</span>
              <span className="font-semibold text-ink">{bar.value.toLocaleString()}</span>
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
