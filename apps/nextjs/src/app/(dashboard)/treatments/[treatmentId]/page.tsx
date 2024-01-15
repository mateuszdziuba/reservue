import Link from "next/link";

import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";
import { DashboardShell } from "../../components/dashboard-shell";

export default async function CustomerFormPage({
  params,
}: {
  params: { treatmentId: string };
}) {
  const data = await api.customerForm.byId(Number(params.treatmentId));

  return (
    <DashboardShell
      title={`${data?.customer.firstName} ${data?.customer.lastName}`}
      description={`Uzupełnij formularz: ${data?.form.title}`}
    >
      <Button asChild size="lg">
        {data?.status === 2 ? (
          <p>Formularz został juz uzupełniony</p>
        ) : (
          <Link href={`/treatments/${params.treatmentId}/fill`}>
            ROZPOCZNIJ UZUPEŁNIANIE FORMULARZA
          </Link>
        )}
      </Button>
    </DashboardShell>
  );
}
