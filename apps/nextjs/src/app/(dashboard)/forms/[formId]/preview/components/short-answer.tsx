import type { Control } from "react-hook-form";
import React from "react";

import type { ComponentItems } from "../../../types";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

interface Props {
  data: ComponentItems;
  control: Control;
  name: string;
  disabled: boolean;
}

export function ShortAnswer(props: Props) {
  // Your component logic here

  return (
    <FormField
      control={props.control}
      name={props.name}
      disabled={props.disabled}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base">
            {props.data.question?.content}
          </FormLabel>
          <FormControl>
            <Input placeholder="Wpisz swoją odpowiedź" {...field} />
          </FormControl>
          <FormDescription></FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
