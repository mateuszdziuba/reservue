import type { Control } from "react-hook-form";
import React from "react";
import { Text, View } from "react-native";
import Checkbox from "expo-checkbox";
import { Controller } from "react-hook-form";

import type { ComponentItems } from "@reservue/types";

interface Props {
  data: ComponentItems;
  control: Control;
  name: string;
  disabled: boolean;
}

export function MultipleSelection(props: Props) {
  return (
    <Controller
      control={props.control}
      name={props.name}
      defaultValue={[]}
      disabled={props.disabled}
      render={() => (
        <View className="gap-3">
          <Text className="text-lg">{props.data.question?.content}</Text>
          <View className="gap-2 text-lg">
            {props.data.options.map((item) => (
              <Controller
                key={item.id}
                control={props.control}
                name={props.name}
                disabled={props.disabled}
                render={({ field }) => {
                  field.value ??= [];
                  return (
                    <View
                      key={item.id}
                      className="flex flex-row items-start gap-2"
                    >
                      <Checkbox
                        value={field.value?.includes(item.id)}
                        onValueChange={(checked) => {
                          if (checked) {
                            field.onChange([...field.value, item.id]);
                          } else {
                            field.onChange(
                              field.value.filter(
                                (v: number | undefined) => v !== item.id,
                              ),
                            );
                          }
                        }}
                        disabled={props.disabled}
                      />
                      <Text className="text-lg font-normal">
                        {item.content}
                      </Text>
                    </View>
                  );
                }}
              />
            ))}
          </View>
        </View>
      )}
    />
  );
}
