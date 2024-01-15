import type { Form } from "~/app/(dashboard)/forms/types";
import { FormPreview } from "~/app/(dashboard)/forms/[formId]/preview/form-preview";
import { api } from "~/trpc/server";

export default async function CustomerFormPage({
  params,
}: {
  params: { treatmentId: string };
}) {
  const data = await api.customerForm.byId(Number(params.treatmentId));
  const formData = await api.form.byId({ formId: String(data?.formId) });
  if (data?.status === 0) {
    await api.customerForm.updateStatus({
      id: Number(params.treatmentId),
      status: 1,
    });
  }

  return (
    <main>
      <div className="container flex flex-col pt-4">
        <p className="text-base">{`Klient: ${data?.customer.firstName} ${data?.customer.lastName}`}</p>
        {data?.status === 2 ? (
          <p className="text-2xl">Formularz został ju wypełniony</p>
        ) : (
          <FormPreview data={formData as Form} isSubmitEnabled />
        )}
      </div>
    </main>
  );
}
