"use client";

import { useRouter } from "next/navigation";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import * as z from "zod";

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
import { useToast } from "~/components/ui/use-toast";
import { cn } from "~/lib/utils";
import { useZodForm } from "~/lib/zod-form";
import { api } from "~/trpc/react";

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
  const { toast } = useToast();
  const router = useRouter();

  const { mutateAsync: createCustomerForm } =
    api.customerForm.create.useMutation();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const res = await createCustomerForm(data);
      toast({
        title: "Dodano formularz do klienta",
      });
      router.push(`/treatments/${res.insertId}`);
    } catch (error) {
      toast({
        title: "Błąd",
        description:
          "Nie udało się dodać formularza do klienta. Prawdopodobnie klient już posiada ten formularz.",
        variant: "destructive",
      });
    }
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
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
