"use client";

import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { DashboardShell } from "../components/dashboard-shell";

export default function Forms() {
  const { data } = api.form.byCreatorId.useQuery();

  if (!data) return null;

  return (
    <DashboardShell
      title="Zabiegi"
      description="Wiąż zabiegi z formularzami i swoimi klientami"
      headerAction={<Button asChild></Button>}
    >
      <></>
    </DashboardShell>
  );
}
