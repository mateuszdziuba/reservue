"use client";

import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";

import type {
  ComponentType,
  Form as FormData,
  FormFieldProps,
} from "../../types";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { api } from "~/trpc/react";
import { Agreements } from "./components/agreements";
import { DropdownMenu } from "./components/dropdown-menu";
import { LongAnswer } from "./components/long-answer";
import { MultipleSelection } from "./components/multiple-selection";
import { ShortAnswer } from "./components/short-answer";
import { SingleSelection } from "./components/single-selection";

interface Props {
  data: FormData;
  defaultValues?: Record<string, string>;
  isSubmitEnabled?: boolean;
}

const formComponents: Record<
  ComponentType,
  (props: FormFieldProps) => JSX.Element
> = {
  shortAnswer: ShortAnswer,
  longAnswer: LongAnswer,
  singleSelection: SingleSelection,
  multipleSelection: MultipleSelection,
  dropdownMenu: DropdownMenu,
  agreements: Agreements,
};

export function FormPreview({ data, defaultValues, isSubmitEnabled }: Props) {
  const id = useParams().treatmentId;

  const { mutateAsync: addAnswers } = api.customerForm.addAnswers.useMutation();

  async function onSubmit(values: Record<string, string>) {
    if (!isSubmitEnabled) return;

    const answers = Object.entries(values)
      .filter(([_field, value]) => Boolean(value))
      .map(([field, value]) => ({
        field,
        value: JSON.stringify(value),
      }));
    try {
      await addAnswers({ id: Number(id), answers });
    } catch (error) {}
  }

  const form = useForm({ defaultValues });
  return (
    <>
      {isSubmitEnabled && (
        <div className="mb-4 flex flex-col border-b">
          <p className="text-base">Tytuł: {data.title}</p>
          <p className="text-base">Opis: {data.description}</p>
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          {data.components.map((component) => {
            const Component = formComponents[component.type];
            return (
              <Component
                data={component}
                control={form.control}
                name={`${component.type}-${component.id}`}
                key={component.id}
                disabled={!!defaultValues}
              />
            );
          })}
          {isSubmitEnabled && <Button type="submit">Wyślij</Button>}
        </form>
      </Form>
    </>
  );
}
