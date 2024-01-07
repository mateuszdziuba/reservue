"use client";

import { ArrowUpDown, CheckIcon } from "lucide-react";
import * as z from "zod";

import type { Customer } from "../../customers/_components/columns";
import type { Form as FormType } from "../../forms/types";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { toast } from "~/components/ui/use-toast";
import { cn } from "~/lib/utils";
import { useZodForm } from "~/lib/zod-form";

const FormSchema = z.object({
  formId: z.number({
    required_error: "Wybierz formularz",
  }),
  customerId: z.number({ required_error: "Wybierz klienta" }),
});

export function CreateTreatmentForm({
  forms,
  customers,
}: {
  forms: { label: string; value: number }[];
  customers: { label: string; value: number }[];
}) {
  const form = useZodForm({ schema: FormSchema });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Klient</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? customers.find(
                            (customer) => customer.value === field.value,
                          )?.label
                        : "Wybierz klienta"}
                      <ArrowUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search klienta..."
                      className="h-9"
                    />
                    <CommandEmpty>Nie znaleziono klienta.</CommandEmpty>
                    <CommandGroup>
                      {customers.map((customer) => (
                        <CommandItem
                          value={customer.label}
                          key={customer.value}
                          onSelect={() => {
                            form.setValue("customerId", customer.value);
                          }}
                        >
                          {customer.label}
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              customer.value === field.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>Klient, który wypełni formularz</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="formId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Formularz</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? forms.find((f) => f.value === field.value)?.label
                        : "Wybierz formularz"}
                      <ArrowUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Szukaj formularza..."
                      className="h-9"
                    />
                    <CommandEmpty>Nie znaleziono formularza.</CommandEmpty>
                    <CommandGroup>
                      {forms.map((f) => (
                        <CommandItem
                          value={f.label}
                          key={f.value}
                          onSelect={() => {
                            form.setValue("formId", f.value);
                          }}
                        >
                          {f.label}
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              f.value === field.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Rozpocznij</Button>
      </form>
    </Form>
  );
}
