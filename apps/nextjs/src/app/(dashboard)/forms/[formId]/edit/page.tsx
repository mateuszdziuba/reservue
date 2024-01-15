import Link from "next/link";

import type { Form } from "../../types";
import { DashboardShell } from "~/app/(dashboard)/components/dashboard-shell";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";
import { FormBuilder } from "../../builder/form-builder";

export default async function FormEditor({
  params,
}: {
  params: { formId: string };
}) {
  const data = await api.form.byId({ formId: params.formId });

  return (
    <DashboardShell
      title="Edycja formularza"
      description="Edytuj istniejący formularz"
      headerAction={
        <Button asChild>
          <Link href="/forms">Wróć</Link>
        </Button>
      }
    >
      <FormBuilder initialData={data as Form} />
    </DashboardShell>
  );
}
