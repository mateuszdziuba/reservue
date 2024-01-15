import Link from "next/link";

import type { Form } from "../../types";
import { DashboardShell } from "~/app/(dashboard)/components/dashboard-shell";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";
import { FormPreview } from "./form-preview";

export default async function FormEditor({
  params,
}: {
  params: { formId: string };
}) {
  const data = await api.form.byId({ formId: params.formId });

  return (
    <DashboardShell
      title={data.title}
      description={data.description}
      headerAction={
        <Button asChild>
          <Link href="/forms">Wróć</Link>
        </Button>
      }
    >
      <FormPreview data={data as Form} />
    </DashboardShell>
  );
}
