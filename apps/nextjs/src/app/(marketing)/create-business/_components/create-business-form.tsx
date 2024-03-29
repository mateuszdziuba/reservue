"use client";

import { useRouter } from "next/navigation";

import type { CreateBusiness } from "@reservue/validators";
import { createBusinessSchema } from "@reservue/validators";

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
import { useZodForm } from "~/lib/zod-form";
import { api } from "~/trpc/react";

export function CreateBusinessForm() {
  const router = useRouter();

  const form = useZodForm({ schema: createBusinessSchema });

  const { mutateAsync: createBusiness, error } =
    api.business.create.useMutation({
      async onSuccess() {
        form.reset();
      },
    });

  async function onSubmit(values: CreateBusiness) {
    try {
      await createBusiness(values);
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form
        className="grid max-w-2xl md:grid-cols-2 md:gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nazwa firmy</FormLabel>
                <FormControl>
                  <Input placeholder="Nazwa" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ownerFirstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imię właściciela</FormLabel>
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
            name="ownerLastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nazwisko właściciela</FormLabel>
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
        </div>
        <div>
          <FormField
            control={form.control}
            name="vatin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NIP</FormLabel>
                <FormControl>
                  <Input placeholder="NIP" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="streetName"
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

        <Button type="submit">Dodaj firmę</Button>
      </form>
    </Form>
  );
}
