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
} from "~/components/ui/form";

interface Props {
  data: ComponentItems;
  control: Control;
  name: string;
  disabled: boolean;
}

export function Agreements(props: Props) {
  return (
    <>
      {props.data.agreements.map((agreement) => (
        <FormField
          key={agreement.id}
          control={props.control}
          name={`${props.name}-${agreement.id}`}
          disabled={props.disabled}
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 ">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  required={agreement.required}
                  disabled={props.disabled}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>{agreement.content}</FormLabel>
                <FormDescription></FormDescription>
              </div>
            </FormItem>
          )}
        />
      ))}
    </>
  );
}
