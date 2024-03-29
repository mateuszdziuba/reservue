import type { Control } from "react-hook-form";

import type { CreateCustomer } from "@reservue/validators";

export const name = "types";

export interface Agreement {
  id?: number;
  content: string;
  required: boolean;
  componentId?: number;
}

export interface Option {
  id?: number;
  content: string;
  componentId?: number;
}

export interface Question {
  id?: number;
  content: string;
  componentId?: number;
}

export type ComponentType =
  | "shortAnswer"
  | "longAnswer"
  | "singleSelection"
  | "multipleSelection"
  | "dropdownMenu"
  | "agreements";

export type FormComponent = {
  id: number | string;
  type: ComponentType;
  formId: number;
} & ComponentItems;

export interface ComponentItems {
  question: Question | null;
  options: Option[];
  agreements: Agreement[];
}

export interface Form {
  id: number;
  title: string;
  description: string;
  createdAt: Date | string; // ISO date string
  updatedAt: Date | string | null; // ISO date string or null
  createdBy: string;
  components: FormComponent[];
}

export interface FormFieldProps {
  data: ComponentItems;
  control: Control;
  name: string;
  disabled: boolean;
}

export interface CustomerForm {
  id: number;
  customerId: number;
  formId: number;
  createdAt: Date | string; // ISO date string
  updatedAt: Date | string | null; // ISO date string or null
  createdBy: string;
  customer?: Pick<CreateCustomer, "firstName" | "lastName">;
  status: number | null;
  form?: Pick<Form, "title">;
}
