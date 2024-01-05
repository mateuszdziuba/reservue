import { relations, sql } from "drizzle-orm";
import { boolean, serial, timestamp, varchar } from "drizzle-orm/mysql-core";

import { mySqlTable } from "./_table";
import { business } from "./business";

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
  formId: varchar("form_id", { length: 256 }).notNull(),
});

export const formQuestion = mySqlTable("form_question", {
  id: serial("id").primaryKey(),
  content: varchar("content", { length: 256 }).notNull(),
  componentId: varchar("component_id", { length: 256 }).notNull(),
});

export const formOption = mySqlTable("form_option", {
  id: serial("id").primaryKey(),
  content: varchar("content", { length: 256 }).notNull(),
  questionId: varchar("question_id", { length: 256 }).notNull(),
});

export const formAgreement = mySqlTable("form_agreement", {
  id: serial("id").primaryKey(),
  content: varchar("content", { length: 256 }).notNull(),
  required: boolean("required"),
  componentId: varchar("component_id", { length: 256 }).notNull(),
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
    agreements: many(formAgreement),
  }),
);

export const formQuestionRelations = relations(
  formQuestion,
  ({ one, many }) => ({
    component: one(formComponent, {
      fields: [formQuestion.componentId],
      references: [formComponent.id],
    }),
    options: many(formOption),
  }),
);

export const formOptionRelations = relations(formOption, ({ one }) => ({
  question: one(formQuestion, {
    fields: [formOption.questionId],
    references: [formQuestion.id],
  }),
}));

export const formAgreementRelations = relations(formAgreement, ({ one }) => ({
  component: one(formComponent, {
    fields: [formAgreement.componentId],
    references: [formComponent.id],
  }),
}));
