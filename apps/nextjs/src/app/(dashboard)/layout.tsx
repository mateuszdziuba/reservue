import type { ReactNode } from "react";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Book } from "lucide-react";

import { auth } from "@reservue/auth";

import { SiteFooter } from "~/components/footer";
import { MainNav } from "~/components/main-nav";
import { UserNav } from "~/components/user-nav";
import { api } from "~/trpc/server";
import { authNavItems } from "../config";

export default async function MarketingLayout(props: { children: ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  const business = await api.business.byOwnerId.query();
  if (!business) redirect("/create-business");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background z-50 flex h-16 items-center border-b px-4">
        <div className="flex space-x-4">
          <div className="mr-8 hidden items-center md:flex">
            <Book className="mr-2 h-6 w-6" />
            <span className="text-lg font-bold tracking-tight">reservue</span>
            {/* <Suspense>
              <BusinessSwitcher />
            </Suspense> */}
          </div>

          {/* <MobileDropdown /> */}
          <MainNav navItems={authNavItems} />
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Suspense>
            <UserNav />
          </Suspense>
        </div>
      </header>

      <main className="flex-1">{props.children}</main>
      <SiteFooter />
    </div>
  );
}
