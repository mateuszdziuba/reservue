import type { Dispatch, SetStateAction } from "react";
import { useEffect, useId, useState } from "react";

import type { ComponentItems } from "../../types";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function Answer({
  updateFormData,
  initialData,
}: {
  updateFormData: Dispatch<SetStateAction<any>>;
  initialData?: ComponentItems;
}) {
  const id = useId();
  const [question, setQuestion] = useState<{
    content: string;
    id?: string | number;
    componentId?: string | number;
  }>(initialData?.question ?? { content: "" });

  useEffect(() => {
    updateFormData({ question });
  }, [question]);

  return (
    <div className="grid w-full max-w-lg items-center gap-1.5">
      <Label htmlFor={id}>Treść pytania</Label>
      <Input
        id={id}
        value={question.content}
        onChange={(e) =>
          setQuestion((prev) => ({ ...prev, content: e.target.value }))
        }
      />
    </div>
  );
}
