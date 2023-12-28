import { Facebook, Mail } from "lucide-react";

import { auth, signIn, signOut } from "@reservue/auth";

import { Button } from "~/components/ui/button";
import { Icons } from "./icons";

export async function AuthShowcase() {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex justify-center gap-2 text-white">
        <form
          action={async () => {
            "use server";
            await signIn("facebook");
          }}
        >
          <Button>
            <Facebook /> Sign in with Facebook
          </Button>
        </form>
        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <Button>
            <Mail />
            Sign in with Google
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-4">
      <p className="text-center text-2xl text-black">
        {session && <span>Logged in as {session.user.name}</span>}
      </p>

      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <Button>Sign out</Button>
      </form>
    </div>
  );
}
