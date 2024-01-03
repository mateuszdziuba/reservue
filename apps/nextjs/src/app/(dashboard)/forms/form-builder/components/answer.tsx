import { useId } from "react";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function Answer() {
  const id = useId();

  return (
    <div className="grid w-full max-w-lg items-center gap-1.5">
      <Label htmlFor={id}>Treść pytania</Label>
      <Input id={id} />
    </div>
  );
}
