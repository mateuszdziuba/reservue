"use client";

import { api } from "~/trpc/react";
import { DashboardShell } from "../components/dashboard-shell";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { NewCustomerDialog } from "./new-customer-dialog";

export default function Customers() {
  const { data } = api.customer.all.useQuery();

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
