import { useId, useState } from "react";
import { Plus, Trash } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

export function Agreements() {
  const [options, setOptions] = useState<
    { option: string; required: boolean }[]
  >([{ option: "", required: false }]);

  const handleChangeOption = (value: string, idx: number) => {
    setOptions((prev) => {
      const updatedOptions = [...prev];
      const optionToUpdate = updatedOptions[idx];
      if (optionToUpdate) optionToUpdate.option = value;
      return updatedOptions;
    });
  };

  const handleChangeCheckedOption = (value: boolean, idx: number) => {
    setOptions((prev) => {
      const updatedOptions = [...prev];
      const optionToUpdate = updatedOptions[idx];
      if (optionToUpdate) optionToUpdate.required = value;
      return updatedOptions;
    });
  };

  const handleDeleteOption = (idx: number) => {
    setOptions((prev) => prev.filter((_, index) => index !== idx));
  };

  const handleAddOption = () => {
    setOptions((prev) => [...prev, { option: "", required: false }]);
  };

  return (
    <div className="grid w-full max-w-lg items-center gap-1.5">
      <Label>
        Zaznacz <Checkbox className="inline" checked disabled />, jeśli zgoda ma
        być wymagana
      </Label>
      {options.map(({ option, required }, idx) => (
        <div className="flex gap-1" key={idx}>
          <Checkbox
            checked={required}
            onCheckedChange={(e) => handleChangeCheckedOption(Boolean(e), idx)}
          />
          <Textarea
            placeholder="Wpisz treść zgody"
            value={option}
            onChange={(e) => handleChangeOption(e.target.value, idx)}
          />
          <Button variant="secondary" onClick={() => handleDeleteOption(idx)}>
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
