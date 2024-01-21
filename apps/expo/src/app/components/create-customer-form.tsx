import type { Dispatch, SetStateAction } from "react";
import React, { useEffect, useState } from "react";
import { Pressable, SafeAreaView, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import type { CreateCustomer } from "~/utils/validators";
import { api } from "~/utils/api";
import { createCustomerSchema } from "~/utils/validators";

export function CreateCustomerForm({
  handleOnSuccess,
  defaultValues,
  setIsVisible,
}: {
  handleOnSuccess?: () => void;
  defaultValues?: CreateCustomer;
  setIsVisible?: Dispatch<SetStateAction<boolean>>;
}) {
  const [canBeEdited, setCanBeEdited] = useState(!defaultValues);
  const { customerId } = useLocalSearchParams();

  const utils = api.useUtils();
  const form = useForm({
    resolver: zodResolver(createCustomerSchema),
    defaultValues,
  });

  const { mutateAsync: createCustomer } = api.customer.create.useMutation({
    async onSuccess() {
      handleOnSuccess?.();
      await utils.customer.byCreatorId.invalidate();
      setIsVisible?.(false);
    },
  });

  const { mutateAsync: updateCustomer } = api.customer.update.useMutation({
    async onSuccess() {
      handleOnSuccess?.();
      await utils.invalidate();
      router.back();
    },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues]);

  async function onSubmit(values: CreateCustomer) {
    try {
      await createCustomer(values);
    } catch (error) {
      console.error(error);
    }
  }

  async function onSubmitUpdate(values: CreateCustomer) {
    try {
      await updateCustomer({ id: Number(customerId), data: values });
    } catch {}
  }

  return (
    <SafeAreaView>
      <View className="gap-2  p-4">
        <Controller
          control={form.control}
          name="firstName"
          disabled={!canBeEdited}
          render={({ field }) => (
            <TextInput
              className="rounded border border-red-500/60 bg-white p-2  text-lg"
              placeholderTextColor="#000"
              placeholder="Imię"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              editable={canBeEdited}
            />
          )}
        />
        <Controller
          control={form.control}
          name="lastName"
          disabled={!canBeEdited}
          render={({ field }) => (
            <TextInput
              className="rounded border border-red-500/60 bg-white p-2  text-lg"
              placeholderTextColor="#000"
              placeholder="Nazwisko"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              editable={canBeEdited}
            />
          )}
        />
        <Controller
          control={form.control}
          name="phoneNumber"
          disabled={!canBeEdited}
          render={({ field }) => (
            <TextInput
              className="rounded border border-red-500/60 bg-white p-2  text-lg"
              placeholderTextColor="#000"
              placeholder="Nr telefonu"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              editable={canBeEdited}
            />
          )}
        />
        <Controller
          control={form.control}
          name="email"
          disabled={!canBeEdited}
          render={({ field }) => (
            <TextInput
              className="rounded border border-red-500/60 bg-white p-2  text-lg"
              placeholderTextColor="#000"
              placeholder="email@example.com"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              editable={canBeEdited}
            />
          )}
        />
        <Controller
          control={form.control}
          name="streetName"
          disabled={!canBeEdited}
          render={({ field }) => (
            <TextInput
              className="rounded border border-red-500/60 bg-white p-2  text-lg"
              placeholderTextColor="#000"
              placeholder="Ulica"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              editable={canBeEdited}
            />
          )}
        />
        <Controller
          control={form.control}
          name="streetNumber"
          disabled={!canBeEdited}
          render={({ field }) => (
            <TextInput
              className="rounded border border-red-500/60 bg-white p-2  text-lg"
              placeholderTextColor="#000"
              placeholder="Nr budynku"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              editable={canBeEdited}
            />
          )}
        />
        <Controller
          control={form.control}
          name="apartmentNumber"
          disabled={!canBeEdited}
          render={({ field }) => (
            <TextInput
              className="rounded border border-red-500/60 bg-white p-2  text-lg"
              placeholderTextColor="#000"
              placeholder="Nr lokalu"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              editable={canBeEdited}
            />
          )}
        />

        <Controller
          control={form.control}
          name="postalCode"
          disabled={!canBeEdited}
          render={({ field }) => (
            <TextInput
              className="rounded border border-red-500/60 bg-white p-2  text-lg"
              placeholderTextColor="#000"
              placeholder="Kod pocztowy"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              editable={canBeEdited}
            />
          )}
        />
        <Controller
          control={form.control}
          name="city"
          disabled={!canBeEdited}
          render={({ field }) => (
            <TextInput
              className="rounded border border-red-500/60 bg-white p-2  text-lg"
              placeholderTextColor="#000"
              placeholder="Miasto"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              editable={canBeEdited}
            />
          )}
        />
        {defaultValues ? (
          canBeEdited ? (
            <View className="flex flex-row gap-2">
              <Pressable
                className="rounded bg-red-500/40 px-4 py-2 "
                disabled={
                  form.formState.isSubmitting || !form.formState.isDirty
                }
                onPress={form.handleSubmit(onSubmitUpdate)}
              >
                <Text className="text-lg font-semibold text-red-500">
                  {" "}
                  Zapisz
                </Text>
              </Pressable>
              <Pressable
                className="rounded bg-red-500/40 px-4 py-2 "
                onPress={() => {
                  setCanBeEdited(false);
                  form.reset(defaultValues);
                }}
              >
                <Text className="text-lg font-semibold text-red-500">
                  Anuluj
                </Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              className="self-start rounded bg-red-500/40 px-4 py-2"
              onPress={() => {
                setCanBeEdited(true);
              }}
            >
              <Text className="text-lg font-semibold text-red-500">Edytuj</Text>
            </Pressable>
          )
        ) : (
          <View className="flex flex-row gap-2">
            <Pressable
              className="rounded bg-red-500/40 px-4 py-2 "
              disabled={form.formState.isSubmitting}
              onPress={form.handleSubmit(onSubmit)}
            >
              <Text className="text-lg font-semibold text-red-500">
                Dodaj klienta
                {form.formState.isSubmitting && "..."}
              </Text>
            </Pressable>
            <Pressable
              className="rounded bg-red-500/40 px-4 py-2"
              onPress={() => setIsVisible?.(false)}
            >
              <Text className="text-lg font-semibold text-red-500">Anuluj</Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
