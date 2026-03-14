import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Patient } from "@/types/domain";

interface PatientFormProps {
  action: (formData: FormData) => void | Promise<void>;
  patient?: Patient;
  submitLabel?: string;
}

const genderOptions = [
  { value: "", label: "Select gender" },
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "other", label: "Other" },
  { value: "unknown", label: "Unknown" },
];

const fieldClassName =
  "w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15";

export function PatientForm({ action, patient, submitLabel = "Create Patient" }: PatientFormProps) {
  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <label className="text-sm font-medium text-ink" htmlFor="firstName">
          First Name
        </label>
        <Input id="firstName" name="firstName" defaultValue={patient?.first_name ?? ""} placeholder="First name" required />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-ink" htmlFor="lastName">
          Last Name
        </label>
        <Input id="lastName" name="lastName" defaultValue={patient?.last_name ?? ""} placeholder="Last name" required />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-ink" htmlFor="birthDate">
          Birth Date
        </label>
        <Input id="birthDate" name="birthDate" type="date" defaultValue={patient?.birth_date ?? ""} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-ink" htmlFor="gender">
          Gender
        </label>
        <select
          id="gender"
          name="gender"
          defaultValue={patient?.gender ?? ""}
          className={fieldClassName}
        >
          {genderOptions.map((option) => (
            <option key={option.value || "empty"} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-ink" htmlFor="mrn">
          Medical Record Number
        </label>
        <Input id="mrn" name="mrn" defaultValue={patient?.mrn ?? ""} placeholder="Medical record number" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-ink" htmlFor="phone">
          Phone
        </label>
        <Input id="phone" name="phone" defaultValue={patient?.phone ?? ""} placeholder="Phone" />
      </div>
      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-medium text-ink" htmlFor="email">
          Email Address
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={patient?.email ?? ""}
          placeholder="name@example.com"
          className="block w-full"
        />
      </div>
      <div className="md:col-span-2">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
