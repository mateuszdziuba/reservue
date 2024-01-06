import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Link, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { z } from "zod";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { toast, useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";

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
    header: "Ostatni zabieg",
    cell: ({ row }) =>
      new Intl.DateTimeFormat("pl-PL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(row.getValue("lastVisitDate")),
  },
  {
    id: "actions",
    cell: function Actions(t) {
      const { mutateAsync: deleteCustomer } = api.customer.delete.useMutation();
      const utils = api.useUtils();
      const { toast } = useToast();

      return (
        <>
          <AlertDialog>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Czy na pewno chcesz usunąć klienta?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Klient zostanie usunięty z serwera, nie będzie mozna go
                  odzyskać.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Anuluj</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    try {
                      await deleteCustomer(Number(t.row.original.id));
                      await utils.customer.byCreatorId.invalidate();

                      toast({
                        title: "Sukces",
                        description: `Pomyślnie usunięto klienta: ${t.row.original.firstName} ${t.row.original.lastName}`,
                      });
                    } catch {
                      toast({
                        description:
                          "Nie udało się usunąć klienta, spróbuj ponownie później",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  Potwierdź
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Otwórz menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/* <DropdownMenuLabel>Akcje</DropdownMenuLabel> */}
                {/* <DropdownMenuSeparator /> */}
                {/* <DropdownMenuItem asChild>
                  <Link href={`/forms/${t.row.original.id}/preview`}>
                    <Eye className="mr-2 h-4 w-4" />
                    <span>Podgląd</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/forms/${t.row.original.id}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    <span>Edytuj</span>
                  </Link>
                </DropdownMenuItem> */}
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="!text-red-500">
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Usuń</span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
          </AlertDialog>
        </>
      );
    },
  },
];
