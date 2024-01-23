import { signIn } from "@reservue/auth";

import { OauthSignin } from "~/app/(auth)/signin/_components/oauth-signin";
import { EmailSignIn } from "./_components/email-signin";

export const runtime = "nodejs";

export default function AuthenticationPage() {
  async function emailSignIn(email: string) {
    "use server";
    await signIn("email", { email, redirectTo: "/dashboard" });
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Zaloguj się</h1>
        <p className="text-muted-foreground text-sm">
          Wpisz swój adres email, aby utworzyć lub zalogować się na swoje konto
        </p>
      </div>
      <div className="grid gap-6">
        <EmailSignIn emailSignIn={emailSignIn} />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background text-muted-foreground px-2">
              Lub kontynuuj z
            </span>
          </div>
        </div>

        <OauthSignin />
      </div>
    </div>
  );
}
