import type { Control } from "react-hook-form";
import React from "react";
import { Text, TextInput, View } from "react-native";
import { Controller } from "react-hook-form";

import type { ComponentItems } from "../../../types";

interface Props {
  data: ComponentItems;
  control: Control;
  name: string;
  disabled: boolean;
}

export function LongAnswer(props: Props) {
  // Your component logic here

  return (
    <Controller
      control={props.control}
      name={props.name}
      disabled={props.disabled}
      render={({ field }) => (
        <View>
          <Text className="text-base">{props.data.question?.content}</Text>
          <TextInput
            placeholder="Wpisz swoją odpowiedź"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
          />
        </View>
      )}
    />
  );
}
