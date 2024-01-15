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
import { formsToCustomers } from "./forms-customers";

export const form = mySqlTable("form", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 256 }).default("").notNull(),
  description: varchar("description", { length: 256 }).default("").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
  createdBy: varchar("created_by", { length: 255 }).notNull(),
});

export const formComponent = mySqlTable("form_component", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 256 }).notNull(),
  formId: int("form_id"),
  order: int("order"),
});

export const formQuestion = mySqlTable("form_question", {
  id: serial("id").primaryKey(),
  content: varchar("content", { length: 256 }).notNull(),
  componentId: int("component_id"),
});

export const formOption = mySqlTable("form_option", {
  id: serial("id").primaryKey(),
  content: varchar("content", { length: 256 }).notNull(),
  componentId: int("component_id"),
});

export const formAgreement = mySqlTable("form_agreement", {
  id: serial("id").primaryKey(),
  content: varchar("content", { length: 256 }).notNull(),
  required: boolean("required"),
  componentId: int("component_id"),
});

export const formAnswer = mySqlTable("form_answer", {
  id: serial("id").primaryKey(),
  field: varchar("field", { length: 256 }).notNull(),
  value: varchar("value", { length: 256 }).notNull(),
  customerFormId: int("customer_form_id"),
});

export const formRelations = relations(form, ({ one, many }) => ({
  business: one(business, {
    fields: [form.createdBy],
    references: [business.id],
  }),
  components: many(formComponent),
  formsToCustomers: many(formsToCustomers),
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

export const formAnswerRelations = relations(formAnswer, ({ one }) => ({
  customerForm: one(formsToCustomers, {
    fields: [formAnswer.customerFormId],
    references: [formsToCustomers.id],
  }),
}));
