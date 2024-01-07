import { relations, sql } from "drizzle-orm";
import { int, timestamp, varchar } from "drizzle-orm/mysql-core";

import { mySqlTable } from "./_table";
import { users } from "./auth";
import { formsToCustomers } from "./forms-customers";

export const customer = mySqlTable("customer", {
  id: int("id").autoincrement().primaryKey(),
  firstName: varchar("first_name", { length: 256 }).notNull(),
  lastName: varchar("last_name", { length: 256 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }),
  streetName: varchar("street_name", { length: 256 }).default(""),
  streetNumber: varchar("street_number", { length: 256 }).default(""),
  apartmentNumber: varchar("apartment_number", { length: 256 }),
  postalCode: varchar("postal_code", { length: 6 }).default(""),
  city: varchar("city", { length: 256 }).default(""),
  lastVisitDate: timestamp("last_visit_date").default(sql`CURRENT_TIMESTAMP`),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
  createdBy: varchar("created_by", { length: 255 }).notNull(),
});

export const customerRelations = relations(customer, ({ one, many }) => ({
  admin: one(users, {
    fields: [customer.createdBy],
    references: [users.id],
  }),
  formsToCustomers: many(formsToCustomers),
}));
