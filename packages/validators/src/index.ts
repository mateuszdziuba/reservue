import { z } from "zod";

export const createBusinessSchema = z.object({
  name: z.string().min(1).max(256), // Corresponds to varchar("name", { length: 256 })
  vatin: z.string().min(1).max(10), // Corresponds to varchar("phone_number", { length: 10 })
  streetName: z.string().min(1).max(256), // Corresponds to varchar("street_name", { length: 256 })
  streetNumber: z.string().min(1), // Corresponds to int("street_number")
  apartmentNumber: z.string().min(1), // Corresponds to int("apartment_number")
  postalCode: z.string().min(1).max(6), // Corresponds to varchar("postal_code", { length: 6 })
  city: z.string().min(1).max(256), // Corresponds to varchar("street_name", { length: 256 })
  ownerFirstName: z.string().min(1).max(256), // Corresponds to varchar("first_name", { length: 256 })
  ownerLastName: z.string().min(1).max(256), // Corresponds to varchar("last_name", { length: 256 })
  phoneNumber: z.string().min(1).max(256), // Corresponds to varchar("phone_number", { length: 256 })
  // ownerId is not included here as it's derived from the session context
});
export type CreateBusiness = z.infer<typeof createBusinessSchema>;

const optionSchema = z.object({
  content: z.string().min(1).max(256),
  id: z.string().min(1).max(256).optional().or(z.number().optional()),
  componentId: z.string().min(1).max(256).optional().or(z.number().optional()),
});

const questionSchema = z.object({
  content: z.string().min(1).max(256),

  id: z.string().min(1).max(256).optional().or(z.number().optional()),
  componentId: z.string().min(1).max(256).optional().or(z.number().optional()),
});

const agreementSchema = z.object({
  content: z.string().min(1).max(256),
  required: z.boolean(),
  id: z.string().min(1).max(256).optional().or(z.number().optional()),
  componentId: z.string().min(1).max(256).optional().or(z.number().optional()),
});

export const componentSchema = z.object({
  id: z.string().min(1).max(256).optional().or(z.number().optional()),
  type: z.string().min(1).max(256),
  question: questionSchema.optional(),
  options: z.array(optionSchema).optional(),
  agreements: z.array(agreementSchema).optional(),
});

export const createFormSchema = z.object({
  id: z.string().min(1).max(256).optional().or(z.number().optional()),
  title: z.string().min(1).max(256),
  description: z.string().min(1).max(256),
  components: z.array(componentSchema),
});
