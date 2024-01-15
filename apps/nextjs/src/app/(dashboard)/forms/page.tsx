import Link from "next/link";

import type { Form } from "./types";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";
import { DataTable } from "../../../components/data-table";
import { DashboardShell } from "../components/dashboard-shell";
import { DataTableToolbar } from "./_components/data-table-toolbar";
import { columns } from "./columns";

export default async function Forms() {
  const data = await api.form.byCreatorId();

  return (
    <DashboardShell
      title="Formularze"
      description="Zarządzaj swoimi formularzami"
      headerAction={
        <Button asChild>
          <Link href="/forms/builder">Dodaj formularz</Link>
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={data as Form[]}
        toolbar={DataTableToolbar}
      />
    </DashboardShell>
  );
}
