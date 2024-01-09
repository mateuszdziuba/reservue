import type { Control } from "react-hook-form";
import React from "react";

import type { ComponentItems } from "../../../types";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

interface Props {
  data: ComponentItems;
  control: Control;
  name: string;
  disabled: boolean;
}

export function SingleSelection(props: Props) {
  // Your component logic here

  return (
    <FormField
      control={props.control}
      name={props.name}
      disabled={props.disabled}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="text-base">
            {props.data.question?.content}
          </FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={props.disabled}
              className="flex flex-col space-y-1"
            >
              {props.data.options?.map((option) => (
                <FormItem
                  className="flex items-center space-x-3 space-y-0"
                  key={option.id}
                >
                  <FormControl>
                    <RadioGroupItem value={String(option.id)} />
                  </FormControl>
                  <FormLabel className="font-normal">
                    {option.content}
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
