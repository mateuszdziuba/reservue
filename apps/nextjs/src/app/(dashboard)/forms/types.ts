export interface Agreement {
  id?: number;
  content: string;
  required: boolean;
  componentId?: string;
}

export interface Option {
  id?: number;
  content: string;
  componentId?: string;
}

export interface Question {
  id?: number;
  content: string;
  componentId?: string;
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
  formId: string;
} & ComponentItems;

export interface ComponentItems {
  question: Question | null;
  options: Option[];
  agreements: Agreement[];
}

export interface Form {
  id: number | string;
  title: string;
  description: string;
  createdAt: Date | string; // ISO date string
  updatedAt: Date | string | null; // ISO date string or null
  createdBy: string;
  components: FormComponent[];
}
