import { Card } from "@/components/ui/card";
import type { Provider } from "@/types/domain";

interface ProviderTableProps {
  providers: Provider[];
}

export function ProviderTable({ providers }: ProviderTableProps) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-line px-6 py-4">
        <h3 className="text-lg font-semibold">Providers</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-3">Provider</th>
              <th className="px-6 py-3">NPI</th>
              <th className="px-6 py-3">Specialty</th>
              <th className="px-6 py-3">Contact</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((provider) => (
              <tr key={provider.id} className="border-t border-line">
                <td className="px-6 py-4 font-semibold">
                  {provider.first_name} {provider.last_name}
                </td>
                <td className="px-6 py-4">{provider.npi ?? "N/A"}</td>
                <td className="px-6 py-4">{provider.specialty ?? "N/A"}</td>
                <td className="px-6 py-4">{provider.email ?? provider.phone ?? "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
