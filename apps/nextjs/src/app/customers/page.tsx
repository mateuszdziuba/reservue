"use client";

import { api } from "~/trpc/react";
import { columns } from "./columns";
import { CreateCustomerForm } from "./customer-form";
import { DataTable } from "./data-table";

export default function Customers() {
  const { data } = api.customer.all.useQuery();

  console.log(data);

  return (
    <>
      {data && <DataTable data={data} columns={columns} />}
      <CreateCustomerForm />
    </>
  );
}
