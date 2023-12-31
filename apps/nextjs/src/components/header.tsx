import { Suspense } from "react";
import { Book } from "lucide-react";

import { auth } from "@reservue/auth";

import BusinessSwitcher from "~/components/business-switcher";
import { MainNav } from "~/components/navbar";
import { UserNav } from "~/components/user-nav";

export async function Header() {
  const session = await auth();

  return (
    <header className="w-full">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center text-black">
          <Book className="mr-2 h-8 w-8" />
          <span className="text-2xl font-bold ">reservue</span>
        </div>
        <Suspense fallback={<p>Loading...</p>}>
          {session && <BusinessSwitcher />}
        </Suspense>
        <MainNav />
        <div className="flex items-center space-x-4">
          <UserNav />
        </div>
      </div>
    </header>
  );
}
