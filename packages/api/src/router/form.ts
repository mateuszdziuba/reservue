import { z } from "zod";

import { and, eq, inArray, schema } from "@reservue/db";
import { createFormSchema } from "@reservue/validators";

import { createTRPCRouter, protectedProcedure } from "../trpc";

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
            orderBy: (components, { asc }) => [asc(components.order)],
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

        for (const component of input.components) {
          const insertedComponent = await trx
            .insert(schema.formComponent)
            .values({
              type: component.type,
              formId: Number(insertedForm.insertId),
            });

          // Iterate and insert questions
          if (component.question) {
            await trx.insert(schema.formQuestion).values({
              content: component.question.content,
              componentId: Number(insertedComponent.insertId),
            });
          }

          // If there are options, insert them
          if (component.options) {
            for (const option of component.options) {
              await trx.insert(schema.formOption).values({
                content: option.content,
                componentId: Number(insertedComponent.insertId),
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
        await trx
          .update(schema.form)
          .set({
            title: input.title,
            description: input.description,
          })
          .where(eq(schema.form.id, Number(input.id)));

        const createdComponentIds = [];
        const createdOptionIds = [];
        const createdAgreementIds = [];

        for (const component of input.components) {
          let componentId =
            typeof component.id === "number" ? component.id : undefined;
          console.log(component.id, typeof component.id);
          if (!componentId) {
            console.log("inserting component");
            const insertedComponent = await trx
              .insert(schema.formComponent)
              .values({
                type: component.type,
                order: component.order,
                formId: input.id,
              });
            componentId = +insertedComponent.insertId;
            createdComponentIds.push(componentId);
          } else {
            await trx
              .update(schema.formComponent)
              .set({
                order: component.order,
              })
              .where(eq(schema.formComponent.id, componentId));
          }

          if (component.question) {
            let questionId = component.question.id;

            if (!questionId) {
              const insertedQuestion = await trx
                .insert(schema.formQuestion)
                .values({
                  content: component.question.content,
                  componentId,
                });
              questionId = +insertedQuestion.insertId;
            } else {
              await trx
                .update(schema.formQuestion)
                .set({
                  content: component.question.content,
                })
                .where(eq(schema.formQuestion.id, questionId));
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
                  .where(eq(schema.formOption.id, option.id));
              } else {
                const insertedOption = await trx
                  .insert(schema.formOption)
                  .values({
                    content: option.content,
                    componentId,
                  });
                createdOptionIds.push(+insertedOption.insertId);
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
                  .where(eq(schema.formAgreement.id, agreement.id));
              } else {
                const insertedAgreement = await trx
                  .insert(schema.formAgreement)
                  .values({
                    content: agreement.content,
                    required: agreement.required,
                    componentId,
                  });
                createdAgreementIds.push(+insertedAgreement.insertId);
              }
            }
          }
        }

        // Handle deletions for removed components
        const existingComponentIds = await trx
          .select({ id: schema.formComponent.id })
          .from(schema.formComponent)
          .where(eq(schema.formComponent.formId, Number(input.id)))
          .then((res) => res.map(({ id }) => id));

        const inputComponentIds = input.components
          .filter((component) => component.id !== undefined)
          .map((component) => component.id);

        const allCurrentComponentIds = [
          ...inputComponentIds,
          ...createdComponentIds,
        ];

        const componentIdsToDelete = existingComponentIds.filter(
          (existingId) => !allCurrentComponentIds.includes(existingId),
        );

        for (const id of componentIdsToDelete) {
          await trx
            .delete(schema.formComponent)
            .where(eq(schema.formComponent.id, id));

          await trx
            .delete(schema.formQuestion)
            .where(eq(schema.formQuestion.componentId, id));

          await trx
            .delete(schema.formOption)
            .where(eq(schema.formOption.componentId, id));

          await trx
            .delete(schema.formAgreement)
            .where(eq(schema.formAgreement.componentId, id));
        }

        const existingOptionIds = [];
        const existingAgreementIds = [];

        for (const id of existingComponentIds) {
          const optionIdsForComponent = await trx
            .select({ id: schema.formOption.id })
            .from(schema.formOption)
            .where(eq(schema.formOption.componentId, id))
            .then((res) => res.map(({ id }) => id));

          const agreementIdsForComponent = await trx
            .select({ id: schema.formAgreement.id })
            .from(schema.formAgreement)
            .where(eq(schema.formAgreement.componentId, id))
            .then((res) => res.map(({ id }) => id));

          existingOptionIds.push(...optionIdsForComponent);
          existingAgreementIds.push(...agreementIdsForComponent);
        }

        const inputOptionIds = input.components
          .flatMap((component) => component.options ?? [])
          .filter((option) => option.id !== undefined)
          .map((option) => option.id);

        const allCurrentOptionIds = [...inputOptionIds, ...createdOptionIds];

        const optionIdsToDelete =
          existingOptionIds?.filter(
            (existingId) => !allCurrentOptionIds.includes(existingId),
          ) ?? [];

        if (optionIdsToDelete.length > 0) {
          await trx
            .delete(schema.formOption)
            .where(inArray(schema.formOption.id, optionIdsToDelete));
        }

        const inputAgreementIds = input.components
          .flatMap((component) => component.agreements ?? [])
          .filter((agreement) => agreement.id !== undefined)
          .map((agreement) => agreement.id);

        const allCurrentAgreementIds = [
          ...inputAgreementIds,
          ...createdAgreementIds,
        ];

        const agreementIdsToDelete =
          existingAgreementIds?.filter(
            (existingId) => !allCurrentAgreementIds.includes(existingId),
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
        .where(eq(schema.formComponent.formId, input))
        .then((res) => res.map(({ id }) => id));

      await trx
        .delete(schema.formComponent)
        .where(eq(schema.formComponent.formId, input));

      if (componentIds.length === 0) {
        return;
      }

      await trx
        .delete(schema.formQuestion)
        .where(inArray(schema.formQuestion.componentId, componentIds));

      await trx
        .delete(schema.formOption)
        .where(inArray(schema.formOption.componentId, componentIds));

      await trx
        .delete(schema.formAgreement)
        .where(inArray(schema.formAgreement.componentId, componentIds));

      const customerFormIdsToDelete = await trx
        .select({ id: schema.formsToCustomers.id })
        .from(schema.formsToCustomers)
        .where(eq(schema.formsToCustomers.formId, input))
        .then((res) => res.map(({ id }) => id));

      await trx
        .delete(schema.formsToCustomers)
        .where(eq(schema.formsToCustomers.formId, input));

      await trx
        .delete(schema.formAnswer)
        .where(
          inArray(schema.formAnswer.customerFormId, customerFormIdsToDelete),
        );
    });
  }),
});
