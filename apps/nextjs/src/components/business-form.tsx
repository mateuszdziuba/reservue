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

export function CreateBusinessForm() {
  const utils = api.useUtils();

  const form = useForm({ defaultValues: { name: "", description: "" } });

  const { mutateAsync: createBusiness, error } =
    api.business.create.useMutation({
      async onSuccess() {
        form.reset();
        await utils.business.byOwnerId.invalidate();
      },
    });

  async function onSubmit(values, e) {
    e.preventDefault();
    try {
      await createBusiness({
        name: values.name,
        description: values.description,
      });
      if (error?.data?.zodError?.fieldErrors.name) {
        form.setError("name", {
          message: error?.data?.zodError?.fieldErrors.name[0],
        });
      }
      if (error?.data?.zodError?.fieldErrors.description) {
        form.setError("description", {
          message: error?.data?.zodError?.fieldErrors.description[0],
        });
      }
      await utils.business.byOwnerId.invalidate();
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
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
