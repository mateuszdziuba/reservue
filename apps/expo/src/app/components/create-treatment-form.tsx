import type { Dispatch, SetStateAction } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Picker } from "@react-native-picker/picker";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "~/utils/api";

const FormSchema = z.object({
  formId: z.string({
    required_error: "Wybierz formularz",
  }),
  customerId: z.string({ required_error: "Wybierz klienta" }),
});

export function CreateTreatmentForm({
  setIsVisible,
}: {
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}) {
  const { data: customersData } = api.customer.byCreatorId.useQuery();
  const { data: formsData } = api.form.byCreatorId.useQuery();

  const router = useRouter();
  const utils = api.useUtils();
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: { formId: "", customerId: "" },
  });

  const { mutateAsync: createCustomerForm } =
    api.customerForm.create.useMutation({
      async onSuccess() {
        await utils.customerForm.all.invalidate();
        setIsVisible(false);
      },
    });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const res = await createCustomerForm({
        formId: Number(data.formId),
        customerId: Number(data.customerId),
      });

      router.push(`/treatments/${res.insertId}/`);
    } catch (error) {}
  }

  return (
    <SafeAreaView>
      <View>
        <Controller
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <View>
              <Text className="text-lg">Wybierz klienta</Text>
              <Picker
                onValueChange={field.onChange}
                selectedValue={field.value}
              >
                {customersData?.map((option) => (
                  <Picker.Item
                    key={option.id}
                    label={`${option.firstName} ${option.lastName}`}
                    value={String(option.id)}
                  />
                ))}
              </Picker>
            </View>
          )}
        />
        <Controller
          control={form.control}
          name="formId"
          render={({ field }) => (
            <View>
              <Text className="text-lg">Wybierz formularz</Text>
              <Picker
                onValueChange={field.onChange}
                selectedValue={field.value}
              >
                {formsData?.map((option) => (
                  <Picker.Item
                    key={option.id}
                    label={option.title}
                    value={String(option.id)}
                  />
                ))}
              </Picker>
            </View>
          )}
        />
        <Pressable
          className="rounded bg-red-500/40 px-4 py-2 "
          disabled={form.formState.isSubmitting}
          onPress={form.handleSubmit(onSubmit)}
        >
          <Text>Wypełnij</Text>
        </Pressable>
        <Pressable onPress={() => setIsVisible(false)}>
          <Text>Anuluj</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
