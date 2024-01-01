import { signOut } from "@reservue/auth";

import { Button } from "~/components/ui/button";

export default function AuthenticationPage() {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Wyloguj się</h1>
        <p className="text-muted-foreground text-sm">
          Czy na pewno chcesz się wylogować?
        </p>
        <form
          className="min-w-full"
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <Button className="min-w-full">Potwierdź</Button>
        </form>
      </div>
    </div>
  );
}
