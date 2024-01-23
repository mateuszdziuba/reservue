"use client";

import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export function EmailSignIn({
  emailSignIn,
}: {
  emailSignIn: (email: string) => Promise<void>;
}) {
  const [email, setEmail] = useState("");
  return (
    <form action={async () => await emailSignIn(email)} className="grid gap-2">
      <div className="grid gap-1">
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          placeholder="name@example.com"
          type="email"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect="off"
          className="bg-background"
        />
      </div>
      <Button type="submit">
        {/* {isLoading && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />} */}
        Zaloguj się adresem email
      </Button>
    </form>
  );
}
