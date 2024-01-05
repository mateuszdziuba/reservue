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

      const form = await ctx.db.query.form.findFirst({
        where: and(
          eq(schema.form.id, input.formId),
          eq(schema.form.createdBy, ctx.session.user.id),
        ),
        with: {
          components: {
            with: {
              question: true,
              options: true,
              agreements: true,
            },
          },
        },
      });

      if (!form) {
        throw new Error("Form not found");
      }

      return form;
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
            await trx.insert(schema.formQuestion).values({
              content: component.question.content,
              componentId: insertedComponent.insertId,
            });
          }
          if (component.options) {
            for (const option of component.options) {
              await trx.insert(schema.formOption).values({
                content: option.content,
                componentId: insertedComponent.insertId,
              });
            }
          }

          if (component.agreements) {
            for (const agreement of component.agreements) {
              await trx.insert(schema.formAgreement).values({
                content: agreement.content,
                required: agreement.required,
                componentId: insertedComponent.insertId,
              });
            }
          }
        }

        return insertedForm; // or some confirmation message
      });
    }),

  update: protectedProcedure
    .input(createFormSchema) // Define this schema to include necessary fields for update
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      return ctx.db.transaction(async (trx) => {
        // Update the form data

        // Iterate over components for update/addition
        for (const component of input.components) {
          let componentId = component.id;

          if (!componentId) {
            const newComponent = await trx
              .insert(schema.formComponent)
              .values({ type: component.type, formId: String(input.id) });
            componentId = newComponent.insertId;
          }

          if (component.question) {
            let questionId = component.question.id;

            if (!questionId) {
              const insertedQuestion = await trx
                .insert(schema.formQuestion)
                .values({
                  content: component.question.content,
                  componentId: String(componentId),
                });
              questionId = insertedQuestion.insertId;
            } else {
              await trx
                .update(schema.formQuestion)
                .set({
                  content: component.question.content,
                })
                .where(eq(schema.formQuestion.id, Number(questionId)));
            }
          }

          if (component.options) {
            for (const option of component.options) {
              if (option.id) {
                await trx
                  .update(schema.formOption)
                  .set({
                    content: option.content,
                  })
                  .where(eq(schema.formOption.id, Number(option.id)));
              } else
                await trx.insert(schema.formOption).values({
                  content: option.content,
                  componentId: String(componentId),
                });
            }
          }

          if (component.agreements) {
            for (const agreement of component.agreements) {
              if (agreement.id) {
                await trx
                  .update(schema.formAgreement)
                  .set({
                    content: agreement.content,
                    required: agreement.required,
                  })
                  .where(eq(schema.formAgreement.id, Number(agreement.id)));
              } else {
                await trx.insert(schema.formAgreement).values({
                  content: agreement.content,
                  required: agreement.required,
                  componentId: String(componentId),
                });
              }
            }
          }
        }

        // Handle deletions for removed components
        const existingComponentIds = await trx
          .select({ id: schema.formComponent.id })
          .from(schema.formComponent)
          .where(eq(schema.formComponent.formId, input.id));

        const componentIdsToDelete = existingComponentIds
          .map(({ id }) => id)
          .filter(
            (id) =>
              !input.components.some(({ id: inFormId }) => id === inFormId),
          );

        console.log(componentIdsToDelete);

        for (const id of componentIdsToDelete) {
          await trx
            .delete(schema.formComponent)
            .where(eq(schema.formComponent.id, id));
          // Also delete related questions, options, agreements if necessary
          await trx
            .delete(schema.formQuestion)
            .where(eq(schema.formQuestion.componentId, String(id)));

          await trx
            .delete(schema.formOption)
            .where(eq(schema.formOption.componentId, String(id)));

          await trx
            .delete(schema.formAgreement)
            .where(eq(schema.formAgreement.componentId, String(id)));
        }

        return { success: true, formId: input.id };
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
