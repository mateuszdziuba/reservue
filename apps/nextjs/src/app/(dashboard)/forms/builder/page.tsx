import Link from "next/link";

import { Button } from "~/components/ui/button";
import { DashboardShell } from "../../components/dashboard-shell";
import { FormBuilder } from "./form-builder";

export default function Builder() {
  return (
    <DashboardShell
      title="Tworzenie formularza"
      description="Zbuduj swój formularz"
      headerAction={
        <Button asChild>
          <Link href="/forms">Wróć</Link>
        </Button>
      }
    >
      <FormBuilder />
    </DashboardShell>
  );
}
