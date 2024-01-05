"use client";

import type { DragEndEvent } from "@dnd-kit/core";
import type { Dispatch, ReactElement, SetStateAction } from "react";
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
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { v4 as uuidv4 } from "uuid";

import type {
  Agreement,
  ComponentItems,
  ComponentType,
  Form,
  FormComponent,
  Option,
  Question,
} from "../types";
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

export function FormBuilder({ initialData }: { initialData?: Form }) {
  const formItems: Record<
    ComponentType,
    {
      name: string;
      component: ({
        initialData,
        updateFormData,
      }: {
        initialData?: ComponentItems;
        updateFormData: Dispatch<SetStateAction<any>>;
      }) => JSX.Element;
    }
  > = {
    shortAnswer: { name: "Krótka odpowiedź", component: Answer },
    longAnswer: { name: "Długa odpowiedź", component: Answer },
    singleSelection: { name: "Jednokrotny wybór", component: Selection },
    multipleSelection: { name: "Wielokrony wybór", component: Selection },
    dropdownMenu: { name: "Lista rozwijana", component: Selection },
    agreements: { name: "Zgody", component: Agreements },
  };

  const [value, setValue] = useState<ComponentType | "">("");
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [components, setComponents] = useState<
    {
      id: string | number;
      name: string;
      type: ComponentType;
      component: ({
        initialData,
        updateFormData,
      }: {
        initialData?: ComponentItems;
        updateFormData: Dispatch<SetStateAction<any>>;
      }) => JSX.Element;
      updated?: boolean;
      initialData?: ComponentItems;
    }[]
  >([]);
  const [formData, setFormData] = useState<
    Record<string | number, FormComponent>
  >({});

  const componentsIds = useMemo(
    () => components.map(({ id }) => String(id)),
    [components],
  );

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  //TODO: add order logic

  function rearrangeObjectKeys(
    obj: Record<string | number, FormComponent>,
    keyOrder: string[],
  ) {
    const newObj: Record<string | number, FormComponent> = {};
    keyOrder.forEach((key) => {
      if (obj[key]) {
        newObj[key] = obj[key]!;
      }
    });
    return newObj;
  }

  useEffect(() => {
    if (!initialData) return;
    setFormTitle(initialData.title);
    setFormDescription(initialData.description);
    setComponents(
      initialData.components.map(({ id, type, ...rest }) => ({
        id,
        type,
        name: formItems[type].name,
        component: formItems[type].component,
        initialData: rest,
      })),
    );
  }, [initialData]);

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

  function handleDeleteComponent(idx: string | number) {
    setComponents((prev) => [...prev].filter(({ id }) => id !== idx));
  }

  const { mutateAsync: createForm, error: createError } =
    api.form.create.useMutation();
  const { mutateAsync: updateForm, error: updateError } =
    api.form.update.useMutation();

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
            onValueChange={(value: ComponentType) => setValue(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Rodzaj pola" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(formItems).map(([key, value]) => (
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
                  name: formItems[value].name,
                  component: formItems[value].component,
                  updated: true,
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
            {components.map(
              ({
                id,
                name,
                type,
                updated,
                initialData,
                component: Component,
              }) => (
                <FormWrapper
                  key={id}
                  name={name}
                  id={String(id)}
                  onDeleteClick={() => handleDeleteComponent(id)}
                >
                  <Component
                    initialData={initialData}
                    updateFormData={(input) =>
                      setFormData((prev) => ({
                        ...prev,
                        [id]: {
                          ...input,
                          type,
                          id: updated ? undefined : id,
                        },
                      }))
                    }
                  />
                </FormWrapper>
              ),
            )}
          </SortableContext>
        </DndContext>
        <Button
          onClick={async () => {
            const input = {
              title: formTitle,
              description: formDescription,
              components: Object.values(
                rearrangeObjectKeys(formData, componentsIds),
              ),
            };
            try {
              initialData
                ? await updateForm({ id: initialData.id, ...input })
                : await createForm(input);
            } catch (error) {}
          }}
        >
          {initialData ? "Zapisz formularz" : "Dodaj formularz"}
        </Button>
      </div>
    </div>
  );
}
