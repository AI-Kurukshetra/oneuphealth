import { Card } from "@/components/ui/card";
import type { ApiKey } from "@/types/domain";

interface ApiKeyManagerProps {
  apiKeys: ApiKey[];
}

export function ApiKeyManager({ apiKeys }: ApiKeyManagerProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold">Developer API Keys</h3>
      <div className="mt-5 space-y-4">
        {apiKeys.map((apiKey) => (
          <div key={apiKey.id} className="rounded-2xl border border-line p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold">{apiKey.name}</p>
                <p className="text-sm text-slate-500">{apiKey.key_prefix}...</p>
              </div>
              <p className="text-sm text-slate-500">
                {apiKey.permissions.length} permissions
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
