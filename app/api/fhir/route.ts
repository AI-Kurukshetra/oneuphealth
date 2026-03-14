import { ok } from "@/lib/api";

export async function GET() {
  return ok({
    data: {
      resourceTypes: ["Patient", "Observation", "Encounter", "Condition", "Medication", "Procedure", "Claim", "Consent"],
    },
  });
}
