import type { Dispatch, SetStateAction } from "react";
import { useEffect, useId, useState } from "react";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function Answer({
  updateFormData,
}: {
  updateFormData: Dispatch<SetStateAction<any>>;
}) {
  const id = useId();
  const [question, setQuestion] = useState("");

  useEffect(() => {
    updateFormData({ question });
  }, [question]);

  return (
    <div className="grid w-full max-w-lg items-center gap-1.5">
      <Label htmlFor={id}>Treść pytania</Label>
      <Input
        id={id}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
    </div>
  );
}
