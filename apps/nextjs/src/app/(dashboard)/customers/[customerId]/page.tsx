import type { CreateCustomer } from "@reservue/validators";

import { api } from "~/trpc/server";
import { CreateCustomerForm } from "../_components/create-customer-form";
import { DashboardShell } from "../../components/dashboard-shell";

export default async function CustomerPage({
  params,
}: {
  params: { customerId: string };
}) {
  const data = await api.customer.byId.query({ id: Number(params.customerId) });

  return (
    <DashboardShell
      title={`${data?.firstName} ${data?.lastName}`}
      description="Zobacz szczegóły klienta"
    >
      <CreateCustomerForm defaultValues={data as CreateCustomer} />
    </DashboardShell>
  );
}
