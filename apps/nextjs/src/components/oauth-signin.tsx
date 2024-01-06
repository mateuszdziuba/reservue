import Link from "next/link";
import { Facebook } from "lucide-react";

import { auth, signIn, signOut } from "@reservue/auth";

import { Button } from "~/components/ui/button";
import { Icons } from "./icons";

export async function OauthSignin() {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex flex-col gap-2">
        <form
          className="min-w-full"
          action={async () => {
            "use server";
            await signIn("facebook", { redirectTo: "/dashboard" });
          }}
        >
          <Button className="min-w-full">
            <Facebook className="mr-2 h-4 w-4" /> Facebook
          </Button>
        </form>
        <form
          className="min-w-full"
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/dashboard" });
          }}
        >
          <Button className="min-w-full">
            <Icons.google className="mr-2 h-4 w-4" />
            Google
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-base">
        {session && <span>Zalogowany jako {session.user.name}</span>}
      </p>
      <Button asChild>
        <Link href="/signout">Wyloguj się</Link>
      </Button>
    </div>
  );
}
