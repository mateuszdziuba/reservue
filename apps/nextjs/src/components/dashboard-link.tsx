import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { auth } from "@reservue/auth";

import { buttonVariants } from "./ui/button";

export async function DashboardLink() {
  const session = await auth();

  if (!session) {
    return (
      <Link href="/signin" className={buttonVariants({ variant: "outline" })}>
        Zaloguj się
        <ChevronRight className="ml-1 h-4 w-4" />
      </Link>
    );
  }

  return (
    <Link
      href={`/dashboard`}
      className={buttonVariants({ variant: "outline" })}
    >
      Dashboard
      <ChevronRight className="ml-1 h-4 w-4" />
    </Link>
  );
}
