import { relations, sql } from "drizzle-orm";
import { serial, timestamp, varchar } from "drizzle-orm/mysql-core";

import { mySqlTable } from "./_table";
import { users } from "./auth";

export const business = mySqlTable("business", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 256 }).notNull(),
  picture: varchar("picture", { length: 256 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
  ownerId: varchar("owner_id", { length: 255 }).notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  business: many(business),
}));

export const bussinessRelations = relations(business, ({ one }) => ({
  user: one(users, {
    fields: [business.ownerId],
    references: [users.id],
  }),
}));
