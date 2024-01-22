import { Pressable, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm } from "react-hook-form";

import type { ComponentType, Form, FormFieldProps } from "@reservue/types";

import { api } from "~/utils/api";
import { Agreements } from "./agreements";
import { DropdownMenu } from "./dropdown-menu";
import { LongAnswer } from "./long-answer";
import { MultipleSelection } from "./multiple-selection";
import { ShortAnswer } from "./short-answer";

interface Props {
  data: Form;
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
  const utils = api.useUtils();

  const { mutateAsync: addAnswers } = api.customerForm.addAnswers.useMutation({
    async onSuccess() {
      await utils.invalidate();
      router.push("/(tabs)/treatments");
    },
  });
  const { treatmentId } = useLocalSearchParams();
  const router = useRouter();

  async function onSubmit(values: Record<string, string>) {
    if (!isSubmitEnabled) return;

    const answers = Object.entries(values)
      .filter(([_field, value]) => Boolean(value))
      .map(([field, value]) => ({
        field,
        value: JSON.stringify(value),
      }));
    try {
      await addAnswers({ id: Number(treatmentId), answers });
    } catch (error) {}
  }

  const form = useForm({ defaultValues });
  return (
    <>
      {isSubmitEnabled && (
        <View className="mb-4 flex flex-col border-b">
          <Text className="text-base">Tytuł: {data.title}</Text>
          <Text className="text-base">Opis: {data.description}</Text>
        </View>
      )}

      <View className="gap-4 p-4">
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
          <Pressable onPress={form.handleSubmit(onSubmit)}>
            <Text>Wyślij</Text>
          </Pressable>
        )}
      </View>
    </>
  );
}
