"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { ClipboardEdit, MoreHorizontal } from "lucide-react";

import type { Form } from "./types";
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
    cell: ({ row }) => {
      const { mutateAsync: deleteForm } = api.form.delete.useMutation();
      const utils = api.useUtils();

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
                      await deleteForm(Number(row.original.id));
                      await utils.form.byCreatorId.invalidate();
                    } catch {
                      // noop
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
                <DropdownMenuItem asChild>
                  <Link href={`/forms/${row.original.id}/edit`}>
                    <ClipboardEdit className="mr-2 h-4 w-4" />
                    <span>Edytuj</span>
                  </Link>
                </DropdownMenuItem>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem>Usuń</DropdownMenuItem>
                </AlertDialogTrigger>
                {/* <DropdownMenuSeparator /> */}
                <DropdownMenuItem>View customer</DropdownMenuItem>
                <DropdownMenuItem>View payment details</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </AlertDialog>
        </>
      );
    },
  },
];
