"use client";

import type { DragEndEvent } from "@dnd-kit/core";
import type { ReactElement } from "react";
import React, { useEffect, useMemo, useState } from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { v4 as uuidv4 } from "uuid";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { api } from "~/trpc/react";
import { Agreements } from "./components/agreements";
import { Answer } from "./components/answer";
import { FormWrapper } from "./components/form-wrapper";
import { Selection } from "./components/selection";

export function FormBuilder() {
  type FormType =
    | "shortAnswer"
    | "longAnswer"
    | "singleSelection"
    | "multipleSelection"
    | "dropdownMenu"
    | "agreements";

  const formNames: Record<
    FormType,
    { name: string; component: () => ReactElement }
  > = {
    shortAnswer: { name: "Krótka odpowiedź", component: Answer },
    longAnswer: { name: "Długa odpowiedź", component: Answer },
    singleSelection: { name: "Jednokrotny wybór", component: Selection },
    multipleSelection: { name: "Wielokrony wybór", component: Selection },
    dropdownMenu: { name: "Lista rozwijana", component: Selection },
    agreements: { name: "Zgody", component: Agreements },
  };

  const [value, setValue] = useState<FormType | "">("");
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [components, setComponents] = useState<
    {
      id: string;
      name: string;
      type: FormType;
      component: () => ReactElement;
    }[]
  >([]);

  const [formData, setFormData] = useState({});

  const componentsIds = useMemo(
    () => components.map(({ id }) => id),
    [components],
  );

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function rearrangeObjectKeys(obj, keyOrder) {
    const newObj = {};
    keyOrder.forEach((key) => {
      if (obj.hasOwnProperty(key)) {
        newObj[key] = obj[key];
      }
    });
    return newObj;
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setComponents((items) => {
        const oldIndex = componentsIds.indexOf(String(active.id));
        const newIndex = componentsIds.indexOf(String(over?.id));

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  function handleDeleteComponent(idx: string) {
    setComponents((prev) => [...prev].filter(({ id }) => id !== idx));
  }

  const { mutateAsync: createForm, error } = api.form.create.useMutation();

  return (
    <div className="container flex flex-col py-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Tytuł</Label>
        <Input
          id="title"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
        />
        <Label htmlFor="description">Opis</Label>
        <Input
          id="description"
          value={formDescription}
          onChange={(e) => setFormDescription(e.target.value)}
        />
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
              setComponents((prev) => [
                ...prev,
                {
                  id: uuidv4(),
                  type: value,
                  name: formNames[value].name,
                  component: formNames[value].component,
                },
              ]);
            }}
          >
            Dodaj
          </Button>
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext
            items={componentsIds}
            strategy={verticalListSortingStrategy}
          >
            {components.map(({ id, name, type, component: Component }) => (
              <FormWrapper
                key={id}
                name={name}
                id={id}
                onDeleteClick={() => handleDeleteComponent(id)}
              >
                <Component
                  updateFormData={(input) =>
                    setFormData((prev) => ({
                      ...prev,
                      [id]: { ...input, type },
                    }))
                  }
                />
              </FormWrapper>
            ))}
          </SortableContext>
        </DndContext>
        <Button
          onClick={async () => {
            try {
              await createForm({
                title: formTitle,
                description: formDescription,
                components: Object.values(
                  rearrangeObjectKeys(formData, componentsIds),
                ),
              });
            } catch (error) {}
          }}
        >
          Dodaj formularz
        </Button>
      </div>
    </div>
  );
}
