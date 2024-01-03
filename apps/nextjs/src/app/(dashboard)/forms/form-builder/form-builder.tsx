"use client";

import type { ReactElement, ReactNode } from "react";
import React, { useState } from "react";

import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Agreements } from "./components/agreements";
import { Answer } from "./components/answer";
import { FormWrapper } from "./components/form-wrapper";
import { Selection } from "./components/selection";

export function FormBuilder() {
  type FormType =
    | "shortAnswer"
    | "longAnswer"
    | "singleSelection"
    | "mulitpleSelection"
    | "dropdownMenu"
    | "agreements";

  const formNames: Record<
    FormType,
    { name: string; component: () => ReactElement }
  > = {
    shortAnswer: { name: "Krótka odpowiedź", component: Answer },
    longAnswer: { name: "Długa odpowiedź", component: Answer },
    singleSelection: { name: "Jednokrotny wybór", component: Selection },
    mulitpleSelection: { name: "Wielokrony wybór", component: Selection },
    dropdownMenu: { name: "Lista rozwijana", component: Selection },
    agreements: { name: "Zgody", component: Agreements },
  };

  const [value, setValue] = useState<FormType | "">("");
  const [components, setComponents] = useState<(() => ReactElement)[]>([]);

  return (
    <div className="container flex flex-col py-2">
      <div className="flex flex-col  items-center gap-2">
        <div className="flex w-full max-w-lg gap-2">
          <Select
            value={value}
            onValueChange={(value: FormType) => setValue(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Rodzaj pola" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(formNames).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => {
              if (value === "") return;
              setComponents((prev) => [...prev, formNames[value].component]);
            }}
          >
            Dodaj
          </Button>
        </div>
        {components.map((Component, id) => (
          <FormWrapper key={id}>
            <Component />
          </FormWrapper>
        ))}
      </div>
    </div>
  );
}
