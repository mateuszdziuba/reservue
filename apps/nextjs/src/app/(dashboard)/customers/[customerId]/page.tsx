import Link from "next/link";

import type { CreateCustomer } from "@reservue/validators";

import type { CustomerFormColumn } from "./columns";
import { DataTable } from "~/components/data-table";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";
import { CreateCustomerForm } from "../_components/create-customer-form";
import { DashboardShell } from "../../components/dashboard-shell";
import { DataTableToolbar } from "./_components/data-table-toolbar";
import { columns } from "./columns";

export default async function CustomerPage({
  params,
}: {
  params: { customerId: string };
}) {
  const data = await api.customer.byId({ id: Number(params.customerId) });
  const formsData = await api.customerForm.byCutomerId(
    Number(params.customerId),
  );

  const tableData = formsData?.map((form) => ({
    id: form.id,
    title: form.form.title,
    status: form.status,
    createdAt: form.createdAt,
  }));

  return (
    <DashboardShell
      title={`${data?.firstName} ${data?.lastName}`}
      description="Zobacz szczegóły klienta"
      headerAction={
        <Button asChild>
          <Link href="/customers">Wróć</Link>
        </Button>
      }
    >
      <CreateCustomerForm defaultValues={data as CreateCustomer} />
      <h2 className="pb-2 pt-4 text-base font-semibold">Formularze klienta</h2>
      <DataTable
        columns={columns}
        data={tableData as CustomerFormColumn[]}
        toolbar={DataTableToolbar}
      />
    </DashboardShell>
  );
}
