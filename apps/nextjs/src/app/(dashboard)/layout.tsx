import type { ReactNode } from "react";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Book } from "lucide-react";

import { auth } from "@reservue/auth";

import { SiteFooter } from "~/components/footer";
import { MainNav } from "~/components/main-nav";
import { MobileDropdown } from "~/components/mobile-nav";
import { UserNav } from "~/components/user-nav";
import { api } from "~/trpc/server";
import { guestNavItems } from "../config";
import { SidebarNav } from "./components/sidebar";

export default async function DashboardLayout(props: { children: ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  const business = await api.business.byOwnerId();
  if (!business) redirect("/create-business");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background z-50 flex h-16 items-center border-b px-4">
        <div className="flex space-x-4">
          <div className="mr-8 hidden items-center md:flex">
            <Book className="mr-2 h-6 w-6" />
            <span className="text-lg font-bold tracking-tight">reservue</span>
          </div>
          <MobileDropdown isAuthenticated />
          <MainNav navItems={guestNavItems} />
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Suspense>
            <UserNav />
          </Suspense>
        </div>
      </header>

      <div className="container flex min-h-[calc(100vh-14rem)] flex-1 gap-12 p-8 pt-6">
        <aside className="hidden w-52 flex-col md:flex">
          <SidebarNav />
        </aside>
        <main className="flex flex-1 flex-col overflow-hidden">
          {props.children}
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
