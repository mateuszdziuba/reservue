import type { Control } from "react-hook-form";
import React from "react";

import type { ComponentItems } from "@reservue/types";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";

interface Props {
  data: ComponentItems;
  control: Control;
  name: string;
  disabled: boolean;
}

export function LongAnswer(props: Props) {
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
            <Textarea
              placeholder="Wpisz swoją odpowiedź"
              className="resize-none"
              {...field}
            />
          </FormControl>
          <FormDescription></FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
