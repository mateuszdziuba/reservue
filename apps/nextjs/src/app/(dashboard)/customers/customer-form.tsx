"use client";

import { useForm } from "react-hook-form";

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
import { api } from "~/trpc/react";

export function CreateCustomerForm() {
  const utils = api.useUtils();

  const form = useForm({
    defaultValues: { firstName: "", lastName: "", phoneNumber: "", email: "" },
  });

  const { mutateAsync: createCustomer, error } =
    api.customer.create.useMutation({
      async onSuccess() {
        form.reset();
        await utils.customer.all.invalidate();
      },
    });

  async function onSubmit(values, e) {
    e.preventDefault();
    try {
      await createCustomer({
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
        email: values.email,
      });
      // if (error?.data?.zodError?.fieldErrors.name) {
      //   form.setError("name", {
      //     message: error?.data?.zodError?.fieldErrors.name[0],
      //   });
      // }
      // if (error?.data?.zodError?.fieldErrors.description) {
      //   form.setError("description", {
      //     message: error?.data?.zodError?.fieldErrors.description[0],
      //   });
      // }
      await utils.customer.all.invalidate();
    } catch {
      // noop
    }
  }

  return (
    <Form {...form}>
      <form
        className="flex w-full max-w-2xl flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imię</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwisko</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nr telefonu</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" type="email" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>

        {error?.data?.code === "UNAUTHORIZED" && (
          <span className="mt-2 text-red-500">
            You must be logged in to post
          </span>
        )}
      </form>
    </Form>
  );
}
