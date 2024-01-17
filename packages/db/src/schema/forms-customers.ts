import { relations, sql } from "drizzle-orm";
import {
  int,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

import { mySqlTable } from "./_table";
import { customer } from "./customer";
import { form, formAnswer } from "./form";

export const formsToCustomers = mySqlTable(
  "forms_to_customers",
  {
    id: serial("id").primaryKey(),
    formId: int("form_id").notNull(),
    customerId: int("customer_id").notNull(),
    status: int("status").default(0),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
    createdBy: varchar("created_by", { length: 255 }).notNull().default(""),
  },
  (t) => ({
    customerFormIdx: uniqueIndex("customer_form_idx").on(
      t.formId,
      t.customerId,
    ),
  }),
);

export const formsToCustomersRelations = relations(
  formsToCustomers,
  ({ one, many }) => ({
    form: one(form, {
      fields: [formsToCustomers.formId],
      references: [form.id],
    }),
    customer: one(customer, {
      fields: [formsToCustomers.customerId],
      references: [customer.id],
    }),
    answers: many(formAnswer),
  }),
);
