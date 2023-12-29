import { Suspense } from "react";
import Link from "next/link";

import { auth } from "@reservue/auth";

import { AuthShowcase } from "~/components/auth-showcase";
import {
  BusinessCardSkeleton,
  BusinessList,
  CreateBusinessForm,
} from "~/components/businesses";

export const runtime = "edge";

export default async function HomePage() {
  // You don't need to fetch these here, just showing different usages
  // If you don't want the Suspense loading state, you could pass these
  // posts as props as use as initialData in the query.
  const session = await auth();

  if (!session) return <AuthShowcase />;

  return (
    <>
      <main className="flex-1 bg-gray-100 py-8">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-4 text-2xl font-bold">My businesses</h2>

          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <BusinessCardSkeleton />
                <BusinessCardSkeleton />
                <BusinessCardSkeleton />
              </div>
            }
          >
            <BusinessList />
          </Suspense>
        </div>
        <CreateBusinessForm />
      </main>
      <footer className="bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="text-sm text-gray-700">
            © reservue. All rights reserved.
          </div>
          <nav className="space-x-4">
            <Link className="text-sm hover:underline" href="#">
              Privacy Policy
            </Link>
            <Link className="text-sm hover:underline" href="#">
              Terms & Conditions
            </Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
