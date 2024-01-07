import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";
import { DashboardShell } from "../components/dashboard-shell";
import { NewTreatmentDialog } from "./_components/create-treatment-dialog";
import { CreateTreatmentForm } from "./_components/create-treatment-form";

export default async function Treatments() {
  const formsData = await api.form.byCreatorId.query();
  const customersData = await api.customer.byCreatorId.query();

  const forms = formsData.map((form) => ({
    label: form.title,
    value: form.id,
  }));

  const customers = customersData.map((customer) => ({
    label: `${customer.firstName} ${customer.lastName}`,
    value: customer.id,
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
      <></>
    </DashboardShell>
  );
}
