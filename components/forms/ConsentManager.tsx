import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Consent } from "@/types/domain";

interface ConsentManagerProps {
  consents: Consent[];
  action: (formData: FormData) => void | Promise<void>;
}

export function ConsentManager({ consents, action }: ConsentManagerProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <Card className="overflow-hidden">
        <div className="border-b border-line px-6 py-4">
          <h3 className="text-lg font-semibold">Active Consents</h3>
        </div>
        <div className="divide-y divide-line">
          {consents.map((consent) => (
            <div key={consent.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="font-semibold">Patient {consent.patient_id}</p>
                <p className="text-sm text-slate-500">
                  {consent.scope} · {consent.categories.join(", ")}
                </p>
              </div>
              <Badge tone={consent.status === "active" ? "success" : "warning"}>
                {consent.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-6">
        <h3 className="text-lg font-semibold">Create Consent</h3>
        <form action={action} className="mt-4 space-y-4">
          <Input name="patientId" placeholder="Patient UUID" required />
          <Input name="status" placeholder="active" defaultValue="active" required />
          <Input name="scope" placeholder="data-sharing" defaultValue="data-sharing" required />
          <Input
            name="categories"
            placeholder="treatment,payment"
            defaultValue="treatment,payment"
            required
          />
          <Button type="submit">Save Consent</Button>
        </form>
      </Card>
    </div>
  );
}
