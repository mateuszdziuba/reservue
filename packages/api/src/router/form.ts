import { z } from "zod";

import { and, eq, schema } from "@reservue/db";
import { createFormSchema } from "@reservue/validators";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const formRouter = createTRPCRouter({
  byCreatorId: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.form.findMany({
      where: eq(schema.form.createdBy, ctx.session.user.id),
    });
  }),

  byId: protectedProcedure
    .input(
      z.object({
        formId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Verify authentication
      if (!ctx.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      // Start a read operation
      const form = await ctx.db.query.form.findFirst({
        where: and(
          eq(schema.form.createdBy, ctx.session.user.id),
          eq(schema.form.id, input.formId),
        ),
      });

      if (!form) {
        throw new Error("Form not found");
      }
      const result = [];
      // Fetch components
      const components = await ctx.db.query.formComponent.findMany({
        where: eq(schema.formComponent.formId, form.id),
      });

      for (const component of components) {
        const newComponent = {};

        if (["shortAnswer", "longAnswer"].includes(component.type)) {
          newComponent.type = component.type;
          const question = await ctx.db.query.formQuestion.findFirst({
            where: eq(schema.formQuestion.componentId, component.id),
          });

          if (question) {
            newComponent.question = question.content;
          }
        }

        if (
          ["singleSelection", "multipleSelection", "dropdownMenu"].includes(
            component.type,
          )
        ) {
          newComponent.type = component.type;

          const question = await ctx.db.query.formQuestion.findFirst({
            where: eq(schema.formQuestion.componentId, component.id),
          });

          if (question) {
            newComponent.question = question.content;
            const options = await ctx.db.query.formOption.findMany({
              where: eq(schema.formOption.questionId, question.id),
            });
            newComponent.options = options.map(({ content }) => content);
          }
        }

        if (component.type === "agreements") {
          newComponent.type = component.type;
          const agreements = await ctx.db.query.formAgreement.findMany({
            where: eq(schema.formAgreement.componentId, component.id),
          });

          newComponent.agreements = agreements.map(({ content, required }) => ({
            agreement: content,
            required,
          }));
        }

        result.push(newComponent);
      }

      return { ...form, components: result };
    }),

  // byOwnerId: protectedProcedure.query(({ ctx }) => {
  //   // return ctx.db.select().from(schema.form).orderBy(desc(schema.form.id));
  //   return ctx.db.query.form.findFirst({
  //     where: eq(schema.form.ownerId, ctx.session.user.id),
  //   });
  // }),

  create: protectedProcedure
    .input(createFormSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      // Start a transaction
      return ctx.db.transaction(async (trx) => {
        // Insert the business data
        const insertedForm = await trx
          .insert(schema.form)
          .values({ ...input, createdBy: ctx.session.user.id });

        // Iterate and insert questions
        for (const component of input.components) {
          const insertedComponent = await trx
            .insert(schema.formComponent)
            .values({ type: component.type, formId: insertedForm.insertId });

          // If there are options, insert them
          if (component.question) {
            const insertedQuestion = await trx
              .insert(schema.formQuestion)
              .values({
                content: component.question,
                componentId: insertedComponent.insertId,
              });
            if (component.options) {
              for (const option of component.options) {
                await trx.insert(schema.formOption).values({
                  content: option,
                  questionId: insertedQuestion.insertId,
                });
              }
            }
          }

          if (component.agreements) {
            for (const agreement of component.agreements) {
              await trx.insert(schema.formAgreement).values({
                content: agreement.agreement,
                required: agreement.required,
                componentId: insertedComponent.insertId,
              });
            }
          }
        }

        return insertedForm; // or some confirmation message
      });
    }),

  // delete: protectedProcedure.input(z.number()).mutation(({ ctx, input }) => {
  //   if (!ctx.session?.user?.id) {
  //     throw new Error("User not authenticated");
  //   }
  //   return ctx.db
  //     .delete(schema.form)
  //     .where(
  //       and(
  //         eq(schema.form.id, input),
  //         eq(schema.form.ownerId, ctx.session.user.id),
  //       ),
  //     );
  // }),
});
