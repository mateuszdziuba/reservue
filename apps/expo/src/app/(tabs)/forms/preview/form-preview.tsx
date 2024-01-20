"use client";

import { Pressable, View } from "react-native";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { api } from "~/utils/api";
import { Agreements } from "./_components/agreements";
import { DropdownMenu } from "./_components/dropdown-menu";
import { LongAnswer } from "./_components/long-answer";
import { MultipleSelection } from "./_components/multiple-selection";
import { ShortAnswer } from "./_components/short-answer";

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
  singleSelection: DropdownMenu,
  multipleSelection: MultipleSelection,
  dropdownMenu: DropdownMenu,
  agreements: Agreements,
};

export function FormPreview({ data, defaultValues, isSubmitEnabled }: Props) {
  const id = useParams().treatmentId;
  const router = useRouter();

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
      router.push("/");
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

      <View className="w-2/3 space-y-6">
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
        {isSubmitEnabled && (
          <Pressable onPress={form.handleSubmit(onSubmit)}>Wyślij</Pressable>
        )}
      </View>
    </>
  );
}
