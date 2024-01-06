import type { Dispatch, SetStateAction } from "react";
import { useEffect, useId, useState } from "react";
import { Plus, Trash } from "lucide-react";

import type { ComponentItems } from "../../types";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function Selection({
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
  const [options, setOptions] = useState<
    { content: string; id?: string | number; questionId?: string | number }[]
  >(initialData?.options ?? [{ content: "" }, { content: "" }]);

  const handleChangeOption = (value: string, idx: number) => {
    setOptions((prev) => {
      const updatedOptions = [...prev];
      if (updatedOptions[idx]) {
        updatedOptions[idx]!.content = value;
      }
      return updatedOptions;
    });
  };

  const handleDeleteOption = (idx: number) => {
    setOptions((prev) => prev.filter((_, index) => index !== idx));
  };

  const handleAddOption = () => {
    setOptions((prev) => [...prev, { content: "" }]);
  };

  useEffect(() => {
    updateFormData({ question, options });
  }, [question, options]);

  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>Treść pytania</Label>
      <Input
        id={id}
        value={question.content}
        onChange={(e) =>
          setQuestion((prev) => ({ ...prev, content: e.target.value }))
        }
      />
      {options.map((option, idx) => (
        <div className="flex gap-2" key={idx}>
          <Input
            placeholder="Wpisz treść odpowiedzi"
            value={option.content}
            onChange={(e) => handleChangeOption(e.target.value, idx)}
          />
          <Button
            variant="secondary"
            size="icon"
            onClick={() => handleDeleteOption(idx)}
          >
            <Trash />
          </Button>
        </div>
      ))}
      <Button variant="secondary" onClick={handleAddOption}>
        <Plus /> Dodaj odpowiedź
      </Button>
    </div>
  );
}
