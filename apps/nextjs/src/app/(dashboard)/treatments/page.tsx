import type { TreatmentColumn } from "./columns";
import { DataTable } from "~/components/data-table";
import { api } from "~/trpc/server";
import { DashboardShell } from "../components/dashboard-shell";
import { NewTreatmentDialog } from "./_components/create-treatment-dialog";
import { CreateTreatmentForm } from "./_components/create-treatment-form";
import { DataTableToolbar } from "./_components/data-table-toolbar";
import { columns } from "./columns";

export default async function Treatments() {
  const formsData = await api.form.byCreatorId();
  const customersData = await api.customer.byCreatorId();

  const forms = formsData.map((form) => ({
    label: form.title,
    value: form.id,
  }));

  const customers = customersData.map((customer) => ({
    label: `${customer.firstName} ${customer.lastName}`,
    value: customer.id,
  }));

  const data = await api.customerForm.all();
  const tableData = data.map((row) => ({
    id: row.id,
    customer: `${row.customer.lastName} ${row.customer.firstName}`,
    form: row.form.title,
    status: String(row.status),
  }));

  return (
    <DashboardShell
      title="Zabiegi"
      description="Wiąż zabiegi z formularzami i swoimi klientami"
      headerAction={
        <NewTreatmentDialog>
          <CreateTreatmentForm forms={forms} customers={customers} />
        </NewTreatmentDialog>
      }
    >
      <DataTable
        columns={columns}
        data={tableData as unknown as TreatmentColumn[]}
        toolbar={DataTableToolbar}
      />
    </DashboardShell>
  );
}
