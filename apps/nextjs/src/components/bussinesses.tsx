"use client";

import { useState } from "react";
import Link from "next/link";

import type { RouterOutputs } from "@reservue/api";

import { api } from "~/trpc/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function CreateBussinessForm() {
  const utils = api.useUtils();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { mutateAsync: createBussiness, error } =
    api.bussiness.create.useMutation({
      async onSuccess() {
        setName("");
        setDescription("");
        await utils.bussiness.all.invalidate();
      },
    });

  return (
    <form
      className="flex w-full max-w-2xl flex-col"
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          await createBussiness({
            name,
            description,
          });
          setName("");
          setDescription("");
          await utils.bussiness.all.invalidate();
        } catch {
          // noop
        }
      }}
    >
      <input
        className="mb-2 rounded bg-white/10 p-2 text-white"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      {error?.data?.zodError?.fieldErrors.name && (
        <span className="mb-2 text-red-500">
          {error.data.zodError.fieldErrors.name}
        </span>
      )}
      <input
        className="mb-2 rounded bg-white/10 p-2 text-white"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      {error?.data?.zodError?.fieldErrors.description && (
        <span className="mb-2 text-red-500">
          {error.data.zodError.fieldErrors.description}
        </span>
      )}
      {}
      <button type="submit" className="rounded bg-pink-400 p-2 font-bold">
        Create
      </button>
      {error?.data?.code === "UNAUTHORIZED" && (
        <span className="mt-2 text-red-500">You must be logged in to post</span>
      )}
    </form>
  );
}

export function BussinessList() {
  const [bussinesses] = api.bussiness.all.useSuspenseQuery();

  if (bussinesses.length === 0) {
    return (
      <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <BussinessCardSkeleton pulse={false} />
        <BussinessCardSkeleton pulse={false} />
        <BussinessCardSkeleton pulse={false} />

        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
          <p className="text-2xl font-bold text-white">No bussinesses yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {bussinesses.map((p) => {
        return <BussinessCard key={p.id} bussiness={p} />;
      })}
    </div>
  );
}

export function BussinessCard(props: {
  bussiness: RouterOutputs["bussiness"]["all"][number];
}) {
  const utils = api.useUtils();
  const deleteBussiness = api.bussiness.delete.useMutation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.bussiness.name}</CardTitle>
        <CardDescription>{props.bussiness.description}</CardDescription>
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
            await deleteBussiness.mutateAsync(props.bussiness.id);
            await utils.bussiness.all.invalidate();
          }}
        >
          DELETE
        </Button>
      </CardFooter>
    </Card>
  );
}

export function BussinessCardSkeleton(props: { pulse?: boolean }) {
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
