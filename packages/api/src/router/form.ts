import { z } from "zod";

import { and, eq, inArray, schema } from "@reservue/db";
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
          eq(schema.form.id, Number(input.formId)),
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

  create: protectedProcedure
    .input(createFormSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      // Start a transaction
      return ctx.db.transaction(async (trx) => {
        const insertedForm = await trx.insert(schema.form).values({
          title: input.title,
          description: input.description,
          createdBy: ctx.session.user.id,
        });

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
        const createdComponentIds = [];
        const createdOptionIds = [];
        const createdAgreementIds = [];

        // Iterate over components for update/addition
        for (const component of input.components) {
          let componentId = component.id;

          if (!componentId) {
            const newComponent = await trx
              .insert(schema.formComponent)
              .values({ type: component.type, formId: String(input.id) });
            componentId = newComponent.insertId;
            createdComponentIds.push(componentId);
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
              } else {
                const insertedOption = await trx
                  .insert(schema.formOption)
                  .values({
                    content: option.content,
                    componentId: String(componentId),
                  });
                createdOptionIds.push(insertedOption.insertId);
              }
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
                const insertedAgreement = await trx
                  .insert(schema.formAgreement)
                  .values({
                    content: agreement.content,
                    required: agreement.required,
                    componentId: String(componentId),
                  });
                createdAgreementIds.push(insertedAgreement.insertId);
              }
            }
          }
        }

        // Handle deletions for removed components
        const existingComponentIds = await trx
          .select({ id: schema.formComponent.id })
          .from(schema.formComponent)
          .where(eq(schema.formComponent.formId, String(input.id)))
          .then((res) => res.map(({ id }) => id));

        const inputComponentIds = input.components
          .filter((component) => component.id !== undefined)
          .map((component) => String(component.id));

        const allCurrentComponentIds = [
          ...inputComponentIds,
          ...createdComponentIds,
        ];

        const componentIdsToDelete = existingComponentIds.filter(
          (existingId) => !allCurrentComponentIds.includes(String(existingId)),
        );

        for (const id of componentIdsToDelete) {
          await trx
            .delete(schema.formComponent)
            .where(eq(schema.formComponent.id, id));

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

        const existingOptionIds = [];
        const existingAgreementIds = [];

        for (const id of existingComponentIds) {
          const optionIdsForComponent = await trx
            .select({ id: schema.formOption.id })
            .from(schema.formOption)
            .where(eq(schema.formOption.componentId, String(id)))
            .then((res) => res.map(({ id }) => id));

          const agreementIdsForComponent = await trx
            .select({ id: schema.formAgreement.id })
            .from(schema.formAgreement)
            .where(eq(schema.formAgreement.componentId, String(id)))
            .then((res) => res.map(({ id }) => id));

          existingOptionIds.push(...optionIdsForComponent);
          existingAgreementIds.push(...agreementIdsForComponent);
        }

        const inputOptionIds = input.components
          .flatMap((component) => component.options ?? [])
          .filter((option) => option.id !== undefined)
          .map((option) => String(option.id));

        const allCurrentOptionIds = [...inputOptionIds, ...createdOptionIds];

        const optionIdsToDelete =
          existingOptionIds?.filter(
            (existingId) => !allCurrentOptionIds.includes(String(existingId)),
          ) ?? [];

        if (optionIdsToDelete.length > 0) {
          await trx
            .delete(schema.formOption)
            .where(inArray(schema.formOption.id, optionIdsToDelete));
        }

        const inputAgreementIds = input.components
          .flatMap((component) => component.agreements ?? [])
          .filter((agreement) => agreement.id !== undefined)
          .map((agreement) => String(agreement.id));

        const allCurrentAgreementIds = [
          ...inputAgreementIds,
          ...createdAgreementIds,
        ];

        const agreementIdsToDelete =
          existingAgreementIds?.filter(
            (existingId) =>
              !allCurrentAgreementIds.includes(String(existingId)),
          ) ?? [];

        if (agreementIdsToDelete.length > 0) {
          await trx
            .delete(schema.formAgreement)
            .where(inArray(schema.formAgreement.id, agreementIdsToDelete));
        }

        return { success: true, formId: input.id };
      });
    }),

  delete: protectedProcedure.input(z.number()).mutation(({ ctx, input }) => {
    if (!ctx.session?.user?.id) {
      throw new Error("User not authenticated");
    }
    return ctx.db.transaction(async (trx) => {
      await trx
        .delete(schema.form)
        .where(
          and(
            eq(schema.form.id, input),
            eq(schema.form.createdBy, ctx.session.user.id),
          ),
        );

      const componentIds = await trx
        .select({ id: schema.formComponent.id })
        .from(schema.formComponent)
        .where(eq(schema.formComponent.formId, String(input)))
        .then((res) => res.map(({ id }) => id));

      await trx
        .delete(schema.formComponent)
        .where(eq(schema.formComponent.formId, String(input)));

      if (componentIds.length === 0) {
        return;
      }

      await trx
        .delete(schema.formQuestion)
        .where(
          inArray(schema.formQuestion.componentId, componentIds.map(String)),
        );

      await trx
        .delete(schema.formOption)
        .where(
          inArray(schema.formOption.componentId, componentIds.map(String)),
        );

      await trx
        .delete(schema.formAgreement)
        .where(
          inArray(schema.formAgreement.componentId, componentIds.map(String)),
        );
    });
  }),
});
