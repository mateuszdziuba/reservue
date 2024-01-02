import { z } from "zod";

export const CreateBusinessSchema = z.object({
  name: z.string().min(1).max(256), // Corresponds to varchar("name", { length: 256 })
  vatin: z.string().min(1).max(10), // Corresponds to varchar("phone_number", { length: 10 })
  streetName: z.string().min(1).max(256), // Corresponds to varchar("street_name", { length: 256 })
  streetNumber: z.number().int(), // Corresponds to int("street_number")
  apartmentNumber: z.number().int(), // Corresponds to int("apartment_number")
  postalCode: z.string().min(1).max(6), // Corresponds to varchar("postal_code", { length: 6 })
  city: z.string().min(1).max(256), // Corresponds to varchar("street_name", { length: 256 })
  ownerFirstName: z.string().min(1).max(256), // Corresponds to varchar("first_name", { length: 256 })
  ownerLastName: z.string().min(1).max(256), // Corresponds to varchar("last_name", { length: 256 })
  ownerPhoneNumber: z.string().min(1).max(256), // Corresponds to varchar("phone_number", { length: 256 })
  // ownerId is not included here as it's derived from the session context
});
