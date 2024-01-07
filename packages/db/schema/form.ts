import { relations, sql } from "drizzle-orm";
import {
  boolean,
  int,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import { mySqlTable } from "./_table";
import { business } from "./business";

export const form = mySqlTable("form", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 256 }).default("").notNull(),
  description: varchar("description", { length: 256 }).default("").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
  createdBy: varchar("created_by", { length: 255 }).notNull(),
});

export const formComponent = mySqlTable("form_component", {
  id: int("id").autoincrement().primaryKey(),
  type: varchar("type", { length: 256 }).notNull(),
  formId: int("form_id"),
  order: int("order"),
});

export const formQuestion = mySqlTable("form_question", {
  id: int("id").autoincrement().primaryKey(),
  content: varchar("content", { length: 256 }).notNull(),
  componentId: int("component_id"),
});

export const formOption = mySqlTable("form_option", {
  id: int("id").autoincrement().primaryKey(),
  content: varchar("content", { length: 256 }).notNull(),
  componentId: int("component_id"),
});

export const formAgreement = mySqlTable("form_agreement", {
  id: int("id").autoincrement().primaryKey(),
  content: varchar("content", { length: 256 }).notNull(),
  required: boolean("required"),
  componentId: int("component_id"),
});

export const formRelations = relations(form, ({ one, many }) => ({
  business: one(business, {
    fields: [form.createdBy],
    references: [business.id],
  }),
  components: many(formComponent),
}));

export const formComponentRelations = relations(
  formComponent,
  ({ one, many }) => ({
    form: one(form, {
      fields: [formComponent.formId],
      references: [form.id],
    }),
    question: one(formQuestion),
    options: many(formOption),
    agreements: many(formAgreement),
  }),
);

export const formQuestionRelations = relations(formQuestion, ({ one }) => ({
  component: one(formComponent, {
    fields: [formQuestion.componentId],
    references: [formComponent.id],
  }),
}));

export const formOptionRelations = relations(formOption, ({ one }) => ({
  question: one(formComponent, {
    fields: [formOption.componentId],
    references: [formComponent.id],
  }),
}));

export const formAgreementRelations = relations(formAgreement, ({ one }) => ({
  component: one(formComponent, {
    fields: [formAgreement.componentId],
    references: [formComponent.id],
  }),
}));
