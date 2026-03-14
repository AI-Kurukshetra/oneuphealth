import { Card } from "@/components/ui/card";
import { requirePageContext } from "@/lib/auth/session";
import { organizationService } from "@/services/organizationService";

export default async function OrganizationsPage() {
  const context = await requirePageContext();
  const organization = await organizationService.getOrganization(context.organizationId);

  return (
    <Card className="p-6">
      <p className="text-sm uppercase tracking-[0.24em] text-accent">Organizations</p>
      <h2 className="mt-2 text-3xl font-semibold">Tenant Administration</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-line p-5">
          <p className="text-sm text-slate-500">Name</p>
          <p className="mt-2 text-lg font-semibold">{organization?.name ?? "Unknown"}</p>
        </div>
        <div className="rounded-3xl border border-line p-5">
          <p className="text-sm text-slate-500">Slug</p>
          <p className="mt-2 text-lg font-semibold">{organization?.slug ?? "n/a"}</p>
        </div>
        <div className="rounded-3xl border border-line p-5">
          <p className="text-sm text-slate-500">Status</p>
          <p className="mt-2 text-lg font-semibold capitalize">{organization?.status ?? "unknown"}</p>
        </div>
        <div className="rounded-3xl border border-line p-5">
          <p className="text-sm text-slate-500">FHIR Version</p>
          <p className="mt-2 text-lg font-semibold">
            {String(organization?.settings?.fhirVersion ?? "R4")}
          </p>
        </div>
      </div>
    </Card>
  );
}
