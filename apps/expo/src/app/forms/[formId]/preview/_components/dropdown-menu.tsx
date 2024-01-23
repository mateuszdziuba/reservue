import type { Control } from "react-hook-form";
import React from "react";
import { Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Controller } from "react-hook-form";

import type { ComponentItems } from "@reservue/types";

interface Props {
  data: ComponentItems;
  control: Control;
  name: string;
  disabled: boolean;
}

export function DropdownMenu(props: Props) {
  return (
    <Controller
      control={props.control}
      name={props.name}
      disabled={props.disabled}
      render={({ field }) => (
        <View>
          <Text className="text-lg">{props.data.question?.content}</Text>
          <Picker onValueChange={field.onChange} selectedValue={field.value}>
            {props.data.options?.map((option) => (
              <Picker.Item
                key={option.id}
                label={option.content}
                value={String(option.id)}
              />
            ))}
          </Picker>
        </View>
      )}
    />
  );
}
