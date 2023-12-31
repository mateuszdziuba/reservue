"use client";

import Link from "next/link";

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
import { api } from "~/trpc/react";

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
            await utils.business.byOwnerId.invalidate();
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
