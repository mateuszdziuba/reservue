import { api } from "~/trpc/server";
import { DashboardShell } from "../components/dashboard-shell";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { NewCustomerDialog } from "./new-customer-dialog";

export default async function Customers() {
  const data = await api.customer.byCreatorId.query();

  return (
    <DashboardShell
      title="Klienci"
      description="Zarządzaj swoimi klientami"
      headerAction={<NewCustomerDialog />}
    >
      {data && <DataTable data={data} columns={columns} />}
    </DashboardShell>
  );
}
