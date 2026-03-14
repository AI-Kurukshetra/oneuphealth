import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { WebhookSubscription } from "@/types/domain";

interface WebhookManagerProps {
  webhooks: WebhookSubscription[];
}

export function WebhookManager({ webhooks }: WebhookManagerProps) {
  return (
    <Card className="p-6 lg:p-7">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-ink">Webhook Subscriptions</h3>
        <Badge tone="default">{webhooks.length} configured</Badge>
      </div>
      <div className="mt-6 space-y-4">
        {webhooks.map((webhook) => (
          <div key={webhook.id} className="rounded-2xl border border-line p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-ink">{webhook.name}</p>
                <p className="text-sm leading-6 text-slate-500">{webhook.target_url}</p>
              </div>
              <Badge tone={webhook.status === "active" ? "success" : "warning"}>
                {webhook.status}
              </Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Events: {webhook.events.join(", ")}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
