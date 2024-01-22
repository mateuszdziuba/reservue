import type { Control } from "react-hook-form";
import React from "react";

import type { ComponentItems } from "@reservue/types";

import { Checkbox } from "~/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

interface Props {
  data: ComponentItems;
  control: Control;
  name: string;
  disabled: boolean;
}

export function MultipleSelection(props: Props) {
  // Your component logic here

  return (
    <FormField
      control={props.control}
      name={props.name}
      defaultValue={[]}
      disabled={props.disabled}
      render={() => (
        <FormItem>
          <div className="mb-4">
            <FormLabel className="text-base">
              {props.data.question?.content}
            </FormLabel>
            <FormDescription></FormDescription>
          </div>
          {props.data.options.map((item) => (
            <FormField
              key={item.id}
              control={props.control}
              name={props.name}
              disabled={props.disabled}
              render={({ field }) => {
                field.value ??= [];
                return (
                  <FormItem
                    key={item.id}
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(item.id)}
                        onCheckedChange={(checked) => {
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
                    </FormControl>
                    <FormLabel className="font-normal">
                      {item.content}
                    </FormLabel>
                  </FormItem>
                );
              }}
            />
          ))}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
