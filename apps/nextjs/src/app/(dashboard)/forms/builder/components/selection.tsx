import type { Dispatch, SetStateAction } from "react";
import { useEffect, useId, useState } from "react";
import { Plus, Trash } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function Selection({
  updateFormData,
}: {
  updateFormData: Dispatch<SetStateAction<any>>;
}) {
  const id = useId();
  const [question, setQuestion] = useState<string>("");
  const [options, setOptions] = useState<string[]>(["", ""]);

  const handleChangeOption = (value: string, idx: number) => {
    setOptions((prev) => {
      const updatedOptions = [...prev];
      updatedOptions[idx] = value;
      return updatedOptions;
    });
  };

  const handleDeleteOption = (idx: number) => {
    setOptions((prev) => prev.filter((_, index) => index !== idx));
  };

  const handleAddOption = () => {
    setOptions((prev) => [...prev, ""]);
  };

  useEffect(() => {
    updateFormData({ question, options });
  }, [question, options]);

  return (
    <div className="grid w-full max-w-lg items-center gap-1.5">
      <Label htmlFor={id}>Treść pytania</Label>
      <Input
        id={id}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      {options.map((option, idx) => (
        <div className="flex gap-2" key={idx}>
          <Input
            placeholder="Wpisz treść odpowiedzi"
            value={option}
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
