import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export function EmailSignIn() {
  return (
    <form className="grid gap-2">
      <div className="grid gap-1">
        <Input
          name="email"
          placeholder="name@example.com"
          type="email"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect="off"
          className="bg-background"
        />
      </div>
      <Button>
        {/* {isLoading && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />} */}
        Zaloguj się adresem email
      </Button>
    </form>
  );
}
