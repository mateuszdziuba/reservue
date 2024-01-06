"use client";

import Link from "next/link";

import type { Form } from "./types";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { DashboardShell } from "../components/dashboard-shell";
import { DataTable } from "../customers/data-table";
import { columns } from "./columns";

export default function Forms() {
  const [data] = api.form.byCreatorId.useSuspenseQuery();

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
      <DataTable columns={columns} data={data as Form[]} />
    </DashboardShell>
  );
}
