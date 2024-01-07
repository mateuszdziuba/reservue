import { relations, sql } from "drizzle-orm";
import { int, primaryKey, timestamp, varchar } from "drizzle-orm/mysql-core";

import { mySqlTable } from "./_table";
import { customer } from "./customer";
import { form } from "./form";

export const formsToCustomers = mySqlTable(
  "forms_to_customers",
  {
    formId: int("form_id").notNull(),
    customerId: int("customer_id").notNull(),
    status: int("status").default(0),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.formId, t.customerId] }),
  }),
);

export const formsToCustomersRelations = relations(
  formsToCustomers,
  ({ one }) => ({
    form: one(form, {
      fields: [formsToCustomers.formId],
      references: [form.id],
    }),
    customer: one(customer, {
      fields: [formsToCustomers.customerId],
      references: [customer.id],
    }),
  }),
);
