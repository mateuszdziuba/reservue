"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, MoreHorizontal, Trash } from "lucide-react";

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
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useToast } from "~/components/ui/use-toast";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export interface TreatmentColumn {
  customer: string;
  status: 0 | 1 | 2;
  id: number;
  form: string;
}

export const columns: ColumnDef<TreatmentColumn>[] = [
  {
    accessorKey: "customer",
    header: "Klient",
  },
  {
    accessorKey: "form",
    header: "Formularz",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: function Status(t) {
      const status = t.row.original.status;

      return (
        <Badge
          variant="outline"
          className={cn(
            status === 0 && "border-gray-200 text-gray-800",
            status === 1 && "border-yellow-200 text-yellow-800",
            status === 2 && "border-green-200 text-green-800",
          )}
        >
          {status === 0 && "Przypisany do klienta"}
          {status === 1 && "W trakcie"}
          {status === 2 && "Ukończony"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: function Actions(t) {
      const { mutateAsync: deleteForm } = api.customerForm.delete.useMutation();
      const { toast } = useToast();
      const router = useRouter();

      return (
        <>
          <AlertDialog>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Czy na pewno chcesz usunąć formularz klienta?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Formularz klienta zostanie usunięty z serwera, nie będzie
                  mozna go odzyskać.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Anuluj</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    try {
                      await deleteForm(Number(t.row.original.id));
                      router.refresh();
                      toast({
                        title: "Sukces",
                        description: `Pomyślnie usunięto formularz o nazwie: ${t.row.original.form} przypisany do klienta ${t.row.original.customer}`,
                      });
                    } catch {
                      toast({
                        description:
                          "Nie udało się usunąć formularza, spróbuj ponownie później",
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
                <DropdownMenuItem asChild>
                  <Link href={`/treatments/${t.row.original.id}/view`}>
                    <Eye className="mr-2 h-4 w-4" />
                    <span>Podgląd</span>
                  </Link>
                </DropdownMenuItem>

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
