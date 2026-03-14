import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProviderFormProps {
  action: (formData: FormData) => void | Promise<void>;
}

export function ProviderForm({ action }: ProviderFormProps) {
  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      <Input name="firstName" placeholder="First name" required />
      <Input name="lastName" placeholder="Last name" required />
      <Input name="specialty" placeholder="Specialty" />
      <Input name="npi" placeholder="NPI" />
      <Input name="phone" placeholder="Phone" />
      <Input name="email" placeholder="Email" />
      <div className="md:col-span-2">
        <Button type="submit">Add Provider</Button>
      </div>
    </form>
  );
}
