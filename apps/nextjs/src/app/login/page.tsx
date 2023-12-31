import { Suspense } from "react";

import { AuthShowcase } from "~/components/auth-showcase";
import { CreateBusinessForm } from "~/components/business-form";
import { BusinessCardSkeleton, BusinessList } from "~/components/businesses";

export default function Login() {
  return (
    <>
      <AuthShowcase />
      <CreateBusinessForm />
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
    </>
  );
}
