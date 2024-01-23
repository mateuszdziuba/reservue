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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface Props {
  data: ComponentItems;
  control: Control;
  name: string;
  disabled: boolean;
}

export function DropdownMenu(props: Props) {
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
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Wybierz odpowiedź" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {props.data.options?.map((option) => (
                <SelectItem key={option.id} value={String(option.id)}>
                  {option.content}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription></FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
