import { relations, sql } from "drizzle-orm";
import { int, timestamp, varchar } from "drizzle-orm/mysql-core";

import { mySqlTable } from "./_table";
import { users } from "./auth";

export const business = mySqlTable("business", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 256 }).default("").notNull(),
  vatin: varchar("vatin", { length: 10 }).default("").notNull(),
  streetName: varchar("street_name", { length: 256 }).default("").notNull(),
  streetNumber: varchar("street_number", { length: 256 }).default("").notNull(),
  apartmentNumber: varchar("apartment_number", { length: 256 }),
  postalCode: varchar("postal_code", { length: 6 }).default("").notNull(),
  city: varchar("city", { length: 256 }).default("").notNull(),
  ownerFirstName: varchar("first_name", { length: 256 }).default("").notNull(),
  ownerLastName: varchar("last_name", { length: 256 }).default("").notNull(),
  phoneNumber: varchar("phone_number", { length: 256 }).default("").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
  ownerId: varchar("owner_id", { length: 255 }).notNull(),
});

export const bussinessRelations = relations(business, ({ one, many }) => ({
  user: one(users, {
    fields: [business.ownerId],
    references: [users.id],
  }),
  // customers: many(customer),
}));
