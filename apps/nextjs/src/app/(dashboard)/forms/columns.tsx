"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, MoreHorizontal, Pencil, Trash } from "lucide-react";

import type { Form } from "@reservue/types";

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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";

export const columns: ColumnDef<Form>[] = [
  {
    accessorKey: "title",
    header: "Tytuł",
  },
  {
    accessorKey: "description",
    header: "Opis",
  },
  {
    id: "actions",
    cell: function Actions(t) {
      const { mutateAsync: deleteForm } = api.form.delete.useMutation();
      const { toast } = useToast();
      const router = useRouter();

      return (
        <>
          <AlertDialog>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Czy na pewno chcesz usunąć formularz?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Formularz zostanie usunięty z serwera, nie będzie mozna go
                  odzyskać.
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
                        description: `Pomyślnie usunięto formularz o nazwie: ${t.row.original.title}`,
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
                {/* <DropdownMenuLabel>Akcje</DropdownMenuLabel> */}
                {/* <DropdownMenuSeparator /> */}
                <DropdownMenuItem asChild>
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
