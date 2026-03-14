import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Provider } from "@/types/domain";

interface ProviderFormProps {
  action: (formData: FormData) => void | Promise<void>;
  provider?: Provider;
  submitLabel?: string;
}

export function ProviderForm({ action, provider, submitLabel = "Add Provider" }: ProviderFormProps) {
  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      <Input name="firstName" defaultValue={provider?.first_name ?? ""} placeholder="First name" required />
      <Input name="lastName" defaultValue={provider?.last_name ?? ""} placeholder="Last name" required />
      <Input name="specialty" defaultValue={provider?.specialty ?? ""} placeholder="Specialty" />
      <Input name="npi" defaultValue={provider?.npi ?? ""} placeholder="NPI" />
      <Input name="phone" defaultValue={provider?.phone ?? ""} placeholder="Phone" />
      <Input name="email" type="email" defaultValue={provider?.email ?? ""} placeholder="name@example.com" />
      <div className="md:col-span-2">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
