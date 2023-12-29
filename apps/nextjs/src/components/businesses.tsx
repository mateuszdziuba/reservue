"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";

import type { RouterOutputs } from "@reservue/api";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
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
        await utils.business.all.invalidate();
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
      await utils.business.all.invalidate();
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
        {error?.data?.zodError?.fieldErrors.name && (
          <span className="mb-2 text-red-500">
            {error.data.zodError.fieldErrors.name}
          </span>
        )}
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
        {error?.data?.zodError?.fieldErrors.description && (
          <span className="mb-2 text-red-500">
            {error.data.zodError.fieldErrors.description}
          </span>
        )}
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

export function BusinessList() {
  const [businesses] = api.business.byOwnerId.useSuspenseQuery();

  if (businesses.length === 0) {
    return (
      <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <BusinessCardSkeleton pulse={false} />
        <BusinessCardSkeleton pulse={false} />
        <BusinessCardSkeleton pulse={false} />

        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
          <p className="text-2xl font-bold text-white">No businesses yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {businesses.map((p) => {
        return <BusinessCard key={p.id} business={p} />;
      })}
    </div>
  );
}

export function BusinessCard(props: {
  business: RouterOutputs["business"]["all"][number];
}) {
  const utils = api.useUtils();
  const deleteBusiness = api.business.delete.useMutation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.business.name}</CardTitle>
        <CardDescription>{props.business.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Badge>Featured</Badge>
      </CardContent>
      <CardFooter>
        <Link className="text-sm hover:underline" href="#">
          View More
        </Link>
        <Button
          onClick={async () => {
            await deleteBusiness.mutateAsync(props.business.id);
            await utils.business.all.invalidate();
          }}
        >
          DELETE
        </Button>
      </CardFooter>
    </Card>
  );
}

export function BusinessCardSkeleton(props: { pulse?: boolean }) {
  const { pulse = true } = props;
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2
            className={`w-1/4 rounded bg-gray-400  text-2xl font-bold ${
              pulse && "animate-pulse"
            }`}
          >
            &nbsp;
          </h2>
        </CardTitle>
        <CardDescription>
          <p
            className={`mt-2 w-1/3 rounded bg-current text-sm ${
              pulse && "animate-pulse"
            }`}
          >
            &nbsp;
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Badge>Featured</Badge>
      </CardContent>
      <CardFooter>
        <Link className="text-sm hover:underline" href="#">
          View More
        </Link>
      </CardFooter>
    </Card>
  );
}
