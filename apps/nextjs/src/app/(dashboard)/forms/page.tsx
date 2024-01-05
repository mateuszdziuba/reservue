"use client";

import type { Form } from "./types";
import { api } from "~/trpc/react";
import { DataTable } from "../customers/data-table";
import { columns } from "./columns";

export default function Forms() {
  const { data } = api.form.byCreatorId.useQuery();

  if (!data) return null;

  return <DataTable columns={columns} data={data as Form[]} />;
}
