import type { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export interface Form {
  id: number;
  title: string;
  description: string;
}

export const columns: ColumnDef<Form>[] = [
  { accessorKey: "id", header: "ID" },
  {
    accessorKey: "title",
    header: "Tytuł",
  },
  {
    accessorKey: "description",
    header: "Opis",
  },
];
