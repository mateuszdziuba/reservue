import type { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export interface Customer {
  id: number | string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string | null;
  lastVisitDate: Date | null;
}

export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "firstName",
    header: "Imię",
  },
  {
    accessorKey: "lastName",
    header: "Nazwisko",
  },
  {
    accessorKey: "phoneNumber",
    header: "Nr telefonu",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "lastVisitDate",
    header: "Ostatnia wizyta",
  },
];
