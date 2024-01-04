import { Suspense } from "react";

import { api } from "~/trpc/server";
import { DataTable } from "../customers/data-table";
import { columns } from "./columns";

export default async function Forms() {
  const data = await api.form.byCreatorId.query();

  return (
    <Suspense>
      <DataTable columns={columns} data={data} />
    </Suspense>
  );
}
