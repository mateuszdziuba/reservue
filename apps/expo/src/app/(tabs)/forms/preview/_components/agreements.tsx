import type { Control } from "react-hook-form";
import React from "react";
import { Text, View } from "react-native";
import { Checkbox } from "expo-checkbox";
import { Controller } from "react-hook-form";

import type { ComponentItems } from "../../../types";

interface Props {
  data: ComponentItems;
  control: Control;
  name: string;
  disabled: boolean;
}

export function Agreements(props: Props) {
  // Your component logic here

  return (
    <>
      {props.data.agreements.map((agreement) => (
        <Controller
          key={agreement.id}
          control={props.control}
          name={`${props.name}-${agreement.id}`}
          disabled={props.disabled}
          render={({ field }) => (
            <View className="flex flex-row items-start space-x-3 space-y-0 ">
              <Checkbox
                value={field.value}
                onValueChange={field.onChange}
                // required={agreement.required}
                disabled={props.disabled}
              />
              <Text>{agreement.content}</Text>
            </View>
          )}
        />
      ))}
    </>
  );
}
