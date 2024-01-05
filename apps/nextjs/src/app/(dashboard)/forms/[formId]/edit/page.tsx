import type { Form } from "../../types";
import { api } from "~/trpc/server";
import { FormBuilder } from "../../builder/form-builder";

export default async function FormEditor({
  params,
}: {
  params: { formId: string };
}) {
  const data = await api.form.byId.query({ formId: params.formId });

  return <FormBuilder initialData={data as Form} />;
}
