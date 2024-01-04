import { relations, sql } from "drizzle-orm";
import { serial, timestamp, varchar } from "drizzle-orm/mysql-core";

import { mySqlTable } from "./_table";
import { users } from "./auth";
import { business } from "./business";

export const customer = mySqlTable("customer", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 256 }).notNull(),
  lastName: varchar("last_name", { length: 256 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }),
  lastVisitDate: timestamp("last_visit_date").default(sql`CURRENT_TIMESTAMP`),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
  createdBy: varchar("created_by", { length: 255 }).notNull(),
});

export const customerRelations = relations(customer, ({ one }) => ({
  admin: one(users, {
    fields: [customer.createdBy],
    references: [users.id],
  }),
}));
