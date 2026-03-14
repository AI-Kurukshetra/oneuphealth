import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { Patient } from "@/types/domain";

interface PatientTableProps {
  patients: Patient[];
}

export function PatientTable({ patients }: PatientTableProps) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-line px-6 py-4">
        <h3 className="text-lg font-semibold">Patients</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-3">Patient</th>
              <th className="px-6 py-3">MRN</th>
              <th className="px-6 py-3">Birth Date</th>
              <th className="px-6 py-3">Contact</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id} className="border-t border-line">
                <td className="px-6 py-4">
                  <div className="font-semibold">
                    {patient.first_name} {patient.last_name}
                  </div>
                  <div className="text-slate-500">{patient.id}</div>
                </td>
                <td className="px-6 py-4">{patient.mrn ?? "N/A"}</td>
                <td className="px-6 py-4">{formatDate(patient.birth_date)}</td>
                <td className="px-6 py-4">{patient.email ?? patient.phone ?? "N/A"}</td>
                <td className="px-6 py-4">
                  <Badge tone="success">Active</Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/patients/${patient.id}`}
                      className="rounded-full border border-line px-4 py-2 text-xs font-semibold text-ink"
                    >
                      View
                    </Link>
                    <Link
                      href={`/patients/${patient.id}/edit`}
                      className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white"
                    >
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
