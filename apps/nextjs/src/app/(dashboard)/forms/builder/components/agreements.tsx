import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import { Plus, Trash } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

export function Agreements({
  updateFormData,
}: {
  updateFormData: Dispatch<SetStateAction<any>>;
}) {
  const [agreements, setAgreements] = useState<
    { agreement: string; required: boolean }[]
  >([{ agreement: "", required: false }]);

  useEffect(() => {
    updateFormData({ agreements });
  }, [agreements]);

  const handleChangeOption = (value: string, idx: number) => {
    setAgreements((prev) => {
      const updatedAgreements = [...prev];
      const agreementToUpdate = updatedAgreements[idx];
      if (agreementToUpdate) agreementToUpdate.agreement = value;
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
    setAgreements((prev) => [...prev, { agreement: "", required: false }]);
  };

  return (
    <div className="grid w-full max-w-lg items-center gap-1.5">
      <Label>
        Zaznacz <Checkbox className="inline" checked disabled />, jeśli zgoda ma
        być wymagana
      </Label>
      {agreements.map(({ agreement, required }, idx) => (
        <div className="flex items-center gap-2" key={idx}>
          <Checkbox
            checked={required}
            onCheckedChange={(e) => handleChangeCheckedOption(Boolean(e), idx)}
          />
          <Textarea
            placeholder="Wpisz treść zgody"
            value={agreement}
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
