import { z } from "zod";

export const name = "validators";

export const createBusinessSchema = z.object({
  name: z.string().min(1).max(256),
  vatin: z.string().min(1).max(10),
  streetName: z.string().min(1).max(256),
  streetNumber: z.string().min(1),
  apartmentNumber: z.string().min(1),
  postalCode: z.string().min(1).max(6),
  city: z.string().min(1).max(256),
  ownerFirstName: z.string().min(1).max(256),
  ownerLastName: z.string().min(1).max(256),
  phoneNumber: z.string().min(1).max(256),
});
export type CreateBusiness = z.infer<typeof createBusinessSchema>;

export const createCustomerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phoneNumber: z.string().min(1),
  email: z.string().min(1).email().optional(),
  streetName: z.string().min(1).max(256).optional(),
  streetNumber: z.string().min(1).optional(),
  apartmentNumber: z.string().min(1).optional(),
  postalCode: z.string().min(1).max(6).optional(),
  city: z.string().min(1).max(256).optional(),
});
export type CreateCustomer = z.infer<typeof createCustomerSchema>;

const optionSchema = z.object({
  content: z.string().min(1).max(256),
  id: z.number().optional(),
  componentId: z.number().optional(),
});

const questionSchema = z.object({
  content: z.string().min(1).max(256),
  id: z.number().optional(),
  componentId: z.number().optional(),
});

const agreementSchema = z.object({
  content: z.string().min(1).max(256),
  required: z.boolean(),
  id: z.number().optional(),
  componentId: z.number().optional(),
});

export const componentSchema = z.object({
  id: z.number().optional().or(z.string().optional()),
  type: z.string().min(1).max(256),
  question: questionSchema.optional().or(z.null()),
  options: z.array(optionSchema).optional(),
  agreements: z.array(agreementSchema).optional(),
  order: z.number(),
});

export const createFormSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1).max(256),
  description: z.string().min(1).max(256),
  components: z.array(componentSchema),
});

export const answerSchema = z.object({
  field: z.string().min(1).max(256),
  value: z.string().min(1).max(256),
});

export const formAnswersSchema = z.array(answerSchema);

export const createCustomerFormSchema = z.object({
  formId: z.number(),
  customerId: z.number(),
});
