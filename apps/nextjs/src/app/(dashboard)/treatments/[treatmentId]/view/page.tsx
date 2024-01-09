import Link from "next/link";

import type { Form } from "~/app/(dashboard)/forms/types";
import { DashboardShell } from "~/app/(dashboard)/components/dashboard-shell";
import { FormPreview } from "~/app/(dashboard)/forms/[formId]/preview/form-preview";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";

export default async function CustomerFormPage({
  params,
}: {
  params: { treatmentId: string };
}) {
  const customerFormData = await api.customerForm.byId.query(
    Number(params.treatmentId),
  );
  const formData = await api.form.byId.query({
    formId: String(customerFormData?.formId),
  });
  const answersData = await api.customerForm.getAnswers.query(
    Number(params.treatmentId),
  );

  const defaultValues = answersData?.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.field]: JSON.parse(curr.value),
    };
  }, {});

  return (
    <DashboardShell
      title={`${customerFormData?.customer.firstName} ${customerFormData?.customer.lastName}`}
      description={`Uzupełnij formularz: ${customerFormData?.form.title}`}
    >
      <FormPreview data={formData as Form} defaultValues={defaultValues} />
    </DashboardShell>
  );
}
