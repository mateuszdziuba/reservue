"use client";

import type { DragEndEvent } from "@dnd-kit/core";
import type { Dispatch, SetStateAction } from "react";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
  ComponentItems,
  ComponentType,
  Form,
  FormComponent,
} from "@reservue/types";

import { Spinner } from "~/components/spinner";
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
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";
import { Agreements } from "./_components/agreements";
import { Answer } from "./_components/answer";
import { FormWrapper } from "./_components/component-wrapper";
import { Selection } from "./_components/selection";

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

export function FormBuilder({ initialData }: { initialData?: Form }) {
  const [value, setValue] = useState<ComponentType | "">("");
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
      initialData?: ComponentItems;
    }[]
  >([]);
  const [formData, setFormData] = useState<
    Record<string | number, FormComponent>
  >({});

  const componentIds = useMemo(
    () => components.map(({ id }) => String(id)),
    [components],
  );

  const router = useRouter();
  const { toast } = useToast();
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const { mutateAsync: createForm, error: _createError } =
    api.form.create.useMutation();
  const { mutateAsync: updateForm, error: _updateError } =
    api.form.update.useMutation();

  useEffect(() => {
    if (!initialData) return;
    setFormTitle(initialData.title);
    setFormDescription(initialData.description);
    setFormData({});
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
        const oldIndex = componentIds.indexOf(String(active.id));
        const newIndex = componentIds.indexOf(String(over?.id));
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  function handleDeleteComponent(idx: string | number) {
    setComponents((prev) => [...prev].filter(({ id }) => id !== idx));
  }

  function sortArrayByOrder(array: FormComponent[], order: string[]) {
    return array.sort((a, b) => {
      const indexA = order.indexOf(String(a.id));
      const indexB = order.indexOf(String(b.id));

      if (indexA === -1) return 1;
      if (indexB === -1) return -1;

      return indexA - indexB;
    });
  }

  return (
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
      <div className="flex w-full gap-2">
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
          disabled={value === ""}
          onClick={() => {
            if (value === "") return;
            setComponents((prev) => [
              ...prev,
              {
                id: uuidv4(),
                type: value,
                name: formItems[value].name,
                component: formItems[value].component,
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
          items={componentIds}
          strategy={verticalListSortingStrategy}
        >
          {components.map(
            ({ id, name, type, initialData, component: Component }) => (
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
                        id,
                        type,
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
        disabled={isLoading}
        onClick={async () => {
          const input = {
            title: formTitle,
            description: formDescription,
            components: sortArrayByOrder(
              Object.values(formData),
              componentIds,
            ).map((component, order) => ({ ...component, order })),
          };
          try {
            setIsLoading(true);
            if (initialData) {
              await updateForm({ id: initialData.id, ...input });
              toast({
                title: "Sukces",
                description: "Pomyślnie edytowano formularz",
              });
            } else {
              await createForm(input);
              toast({
                title: "Sukces",
                description: "Pomyślnie zapisano formularz",
              });
              router.push("/forms");
            }
          } catch (error) {
            toast({
              title: "Błąd",
              description: "Coś poszło nie tak",
              variant: "destructive",
            });
          } finally {
            router.refresh();
            setIsLoading(false);
          }
        }}
      >
        {isLoading && <Spinner className="mr-1" />}
        {initialData ? "Zapisz formularz" : "Dodaj formularz"}
      </Button>
    </div>
  );
}
