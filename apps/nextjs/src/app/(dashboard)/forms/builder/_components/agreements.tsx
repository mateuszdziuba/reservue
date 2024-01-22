import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import { Plus, Trash } from "lucide-react";

import type { ComponentItems } from "@reservue/types";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

export function Agreements({
  updateFormData,
  initialData,
}: {
  updateFormData: Dispatch<SetStateAction<any>>;
  initialData?: ComponentItems;
}) {
  const [agreements, setAgreements] = useState<
    {
      content: string;
      required: boolean;
      id?: string | number;
      componentId?: string | number;
    }[]
  >(initialData?.agreements || [{ content: "", required: false }]);

  useEffect(() => {
    updateFormData({ agreements });
  }, [agreements, initialData]);

  const handleChangeOption = (value: string, idx: number) => {
    setAgreements((prev) => {
      const updatedAgreements = [...prev];
      const agreementToUpdate = updatedAgreements[idx];
      if (agreementToUpdate) agreementToUpdate.content = value;
      return updatedAgreements;
    });
  };

  const handleChangeCheckedOption = (value: boolean, idx: number) => {
    setAgreements((prev) => {
      const updatedAgreements = [...prev];
      const agreementToUpdate = updatedAgreements[idx];
      if (agreementToUpdate) agreementToUpdate.required = value;
      return updatedAgreements;
    });
  };

  const handleDeleteOption = (idx: number) => {
    setAgreements((prev) => prev.filter((_, index) => index !== idx));
  };

  const handleAddOption = () => {
    setAgreements((prev) => [...prev, { content: "", required: false }]);
  };

  return (
    <div className="grid gap-1.5">
      <Label>
        Zaznacz <Checkbox className="inline" checked disabled />, jeśli zgoda ma
        być wymagana
      </Label>
      {agreements.map(({ content, required }, idx) => (
        <div className="flex items-center gap-2" key={idx}>
          <Checkbox
            checked={required}
            onCheckedChange={(e) => handleChangeCheckedOption(Boolean(e), idx)}
          />
          <Textarea
            placeholder="Wpisz treść zgody"
            value={content}
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
