import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PatientFormProps {
  action: (formData: FormData) => void | Promise<void>;
}

export function PatientForm({ action }: PatientFormProps) {
  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      <Input name="firstName" placeholder="First name" required />
      <Input name="lastName" placeholder="Last name" required />
      <Input name="birthDate" placeholder="YYYY-MM-DD" />
      <Input name="gender" placeholder="Gender" />
      <Input name="mrn" placeholder="Medical record number" />
      <Input name="phone" placeholder="Phone" />
      <Input name="email" placeholder="Email" className="md:col-span-2" />
      <div className="md:col-span-2">
        <Button type="submit">Create Patient</Button>
      </div>
    </form>
  );
}
