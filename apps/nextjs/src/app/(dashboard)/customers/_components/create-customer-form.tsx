"use client";

import { use, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import type { CreateCustomer } from "@reservue/validators";
import { createCustomerSchema } from "@reservue/validators";

import { Spinner } from "~/components/spinner";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useToast } from "~/components/ui/use-toast";
import { useZodForm } from "~/lib/zod-form";
import { api } from "~/trpc/react";

export function CreateCustomerForm({
  handleOnSuccess,
  defaultValues,
}: {
  handleOnSuccess?: () => void;
  defaultValues?: CreateCustomer;
}) {
  const [canBeEdited, setCanBeEdited] = useState(!defaultValues);

  const utils = api.useUtils();
  const form = useZodForm({ schema: createCustomerSchema, defaultValues });
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();

  const { mutateAsync: createCustomer } = api.customer.create.useMutation({
    async onSuccess() {
      handleOnSuccess?.();
      await utils.customer.all.invalidate();
    },
  });

  const { mutateAsync: updateCustomer } = api.customer.update.useMutation({
    async onSuccess() {
      handleOnSuccess?.();
      await utils.customer.all.invalidate();
    },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues]);

  async function onSubmit(values: CreateCustomer) {
    try {
      await createCustomer(values);
      toast({
        title: "Dodano klienta",
        description: `Utworzono klienta: ${values.firstName} ${values.lastName}`,
      });
    } catch {
      toast({
        title: "Błąd podczas tworzenia klienta",
        variant: "destructive",
        description:
          "Podczas tworzenia klienta doszło do błędu. Spróbuj ponownie.",
      });
    }
  }

  async function onSubmitUpdate(values: CreateCustomer) {
    try {
      await updateCustomer({ id: Number(params.customerId), data: values });
      toast({
        title: "Edytowano klienta",
        description: `Edytowano klienta: ${values.firstName} ${values.lastName}`,
      });
      setCanBeEdited(false);
      router.refresh();
    } catch {
      toast({
        title: "Błąd podczas edycji klienta",
        variant: "destructive",
        description:
          "Podczas edycji klienta doszło do błędu. Spróbuj ponownie.",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        className={`grid max-w-2xl ${
          defaultValues ? "md:grid-cols-3" : "md:grid-cols-2"
        } min-w-full md:gap-4`}
        onSubmit={form.handleSubmit(defaultValues ? onSubmitUpdate : onSubmit)}
      >
        <div>
          <FormField
            control={form.control}
            name="firstName"
            disabled={!canBeEdited}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imię</FormLabel>
                <FormControl>
                  <Input placeholder="Imię" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            disabled={!canBeEdited}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nazwisko</FormLabel>
                <FormControl>
                  <Input placeholder="Nazwisko" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            disabled={!canBeEdited}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numer telefonu</FormLabel>
                <FormControl>
                  <Input placeholder="Nr telefonu" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            disabled={!canBeEdited}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adres email</FormLabel>
                <FormControl>
                  <Input placeholder="email@example.com" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name="streetName"
            disabled={!canBeEdited}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ulica</FormLabel>
                <FormControl>
                  <Input placeholder="Ulica" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="streetNumber"
              disabled={!canBeEdited}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nr budynku</FormLabel>
                  <FormControl>
                    <Input placeholder="Nr budynku" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="apartmentNumber"
              disabled={!canBeEdited}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nr lokalu</FormLabel>
                  <FormControl>
                    <Input placeholder="Nr lokalu" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="postalCode"
              disabled={!canBeEdited}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kod pocztowy</FormLabel>
                  <FormControl>
                    <Input placeholder="Kod pocztowy" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              disabled={!canBeEdited}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Miasto</FormLabel>
                  <FormControl>
                    <Input placeholder="Miasto" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {defaultValues ? (
          canBeEdited ? (
            <div className="flex flex-col gap-1">
              <Button
                disabled={
                  form.formState.isSubmitting || !form.formState.isDirty
                }
              >
                Zapisz
              </Button>
              <Button
                variant="secondary"
                onClick={(e) => {
                  e.preventDefault();
                  setCanBeEdited(false);
                  form.reset(defaultValues);
                }}
              >
                Anuluj
              </Button>
            </div>
          ) : (
            <Button
              onClick={(e) => {
                e.preventDefault();
                setCanBeEdited(true);
              }}
            >
              Edytuj
            </Button>
          )
        ) : (
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Spinner className="mr-1" />}Dodaj
            klienta
          </Button>
        )}
      </form>
    </Form>
  );
}
