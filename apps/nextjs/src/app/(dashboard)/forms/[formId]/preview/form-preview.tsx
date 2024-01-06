"use client";

import { useForm } from "react-hook-form";

import type {
  ComponentType,
  Form as FormData,
  FormFieldProps,
} from "../../types";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { Agreements } from "./components/agreements";
import { DropdownMenu } from "./components/dropdown-menu";
import { LongAnswer } from "./components/long-answer";
import { MultipleSelection } from "./components/multiple-selection";
import { ShortAnswer } from "./components/short-answer";
import { SingleSelection } from "./components/single-selection";

interface Props {
  data: FormData;
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

export function FormPreview({ data }: Props) {
  function onSubmit(values) {
    console.log(values);
  }

  const form = useForm();
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        {data.components.map((component) => {
          const Component = formComponents[component.type];
          return (
            <Component
              data={component}
              control={form.control}
              name={`${component.type}-${component.id}`}
              key={component.id}
            />
          );
        })}
        <Button type="submit">Wyślij</Button>
      </form>
    </Form>
  );
}
