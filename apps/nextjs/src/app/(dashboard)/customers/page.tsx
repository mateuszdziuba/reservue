import { api } from "~/trpc/server";
import { DataTable } from "../../../components/data-table";
import { DashboardShell } from "../components/dashboard-shell";
import { columns } from "./_components/columns";
import { DataTableToolbar } from "./_components/data-table-toolbar";
import { NewCustomerDialog } from "./_components/new-customer-dialog";

export default async function Customers() {
  const data = await api.customer.byCreatorId.query();

  return (
    <DashboardShell
      title="Klienci"
      description="Zarządzaj swoimi klientami"
      headerAction={<NewCustomerDialog />}
    >
      {data && (
        <DataTable data={data} columns={columns} toolbar={DataTableToolbar} />
      )}
    </DashboardShell>
  );
}
