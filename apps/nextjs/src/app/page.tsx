import { Suspense } from "react";
import Link from "next/link";
import { Scissors } from "lucide-react";

import { BusinessCardSkeleton, BusinessList } from "~/components/businesses";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";

export const runtime = "edge";

export default async function HomePage() {
  // You don't need to fetch these here, just showing different usages
  // If you don't want the Suspense loading state, you could pass these
  // posts as props as use as initialData in the query.

  return (
    <>
      <main className="flex-1 bg-gray-100 py-8">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-8">
            <Input
              className="h-12 w-full"
              placeholder="Search for a service..."
            />
          </div>
          <h2 className="mb-4 text-2xl font-bold">Categories</h2>
          <div className="mb-8 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
            <Card>
              <CardContent className="flex items-center">
                <Scissors className="mr-2 h-8 w-8" />
                <span>Barber Services</span>
              </CardContent>
            </Card>
          </div>
          <h2 className="mb-4 text-2xl font-bold">Featured Services</h2>

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
