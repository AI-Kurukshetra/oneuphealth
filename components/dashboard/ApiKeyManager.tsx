import Link from "next/link";

import { Card } from "@/components/ui/card";
import type { ApiKey } from "@/types/domain";

interface ApiKeyManagerProps {
  apiKeys: ApiKey[];
}

export function ApiKeyManager({ apiKeys }: ApiKeyManagerProps) {
  return (
    <Card className="p-6 lg:p-7">
      <h3 className="text-lg font-semibold text-ink">Developer API Keys</h3>
      <div className="mt-6 space-y-4">
        {apiKeys.map((apiKey) => (
          <div key={apiKey.id} className="rounded-2xl border border-line p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-ink">{apiKey.name}</p>
                <p className="text-sm leading-6 text-slate-500">{apiKey.key_prefix}...</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm text-slate-500">
                  {apiKey.permissions.length} permissions
                </p>
                <Link
                  href={`/developer/api-keys/${apiKey.id}/edit`}
                  className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white"
                >
                  Edit
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
