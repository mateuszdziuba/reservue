import type { ReactNode } from "react";
import { Suspense } from "react";
import { Book } from "lucide-react";

import { DashboardLink } from "~/app/(marketing)/_components/dashboard-link";
import { SiteFooter } from "~/components/footer";
import { MainNav } from "~/components/main-nav";
import { guestNavItems } from "../config";

export default function MarketingLayout(props: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background z-50 flex h-16 items-center border-b px-4">
        <div className="mr-8 hidden items-center md:flex">
          <Book className="mr-2 h-6 w-6" />
          <span className="text-lg font-bold tracking-tight">reservue</span>
        </div>
        {/* <MobileDropdown /> */}
        <MainNav navItems={guestNavItems} />
        <div className="ml-auto flex items-center space-x-4">
          <Suspense>
            <DashboardLink />
          </Suspense>
        </div>
      </header>

      <main className="flex-1">{props.children}</main>
      <SiteFooter />
    </div>
  );
}
