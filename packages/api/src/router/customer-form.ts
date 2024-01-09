import { z } from "zod";

import { and, desc, eq, schema } from "@reservue/db";
import {
  createCustomerFormSchema,
  formAnswersSchema,
} from "@reservue/validators";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const customerFormRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createCustomerFormSchema)
    .mutation(({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      return ctx.db.insert(schema.formsToCustomers).values(input);
    }),

  byId: protectedProcedure.input(z.number()).query(({ ctx, input }) => {
    if (!ctx.session?.user?.id) {
      throw new Error("User not authenticated");
    }

    return ctx.db.query.formsToCustomers.findFirst({
      where: eq(schema.formsToCustomers.id, input),
      with: {
        customer: true,
        form: true,
      },
    });
  }),

  byCutomerId: protectedProcedure.input(z.number()).query(({ ctx, input }) => {
    if (!ctx.session?.user?.id) {
      throw new Error("User not authenticated");
    }

    return ctx.db.query.formsToCustomers.findMany({
      where: eq(schema.formsToCustomers.customerId, input),
      with: {
        form: true,
      },
    });
  }),

  updateStatus: protectedProcedure
    .input(z.object({ id: z.number(), status: z.number() }))
    .mutation(({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      return ctx.db
        .update(schema.formsToCustomers)
        .set({ status: input.status })
        .where(eq(schema.formsToCustomers.id, input.id));
    }),

  getAnswers: protectedProcedure.input(z.number()).query(({ ctx, input }) => {
    if (!ctx.session?.user?.id) {
      throw new Error("User not authenticated");
    }

    return ctx.db.query.formAnswer.findMany({
      where: eq(schema.formAnswer.customerFormId, input),
    });
  }),

  addAnswers: protectedProcedure
    .input(z.object({ id: z.number(), answers: formAnswersSchema }))
    .mutation(({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      return ctx.db.transaction(async (trx) => {
        await trx
          .update(schema.formsToCustomers)
          .set({ status: 2 })
          .where(eq(schema.formsToCustomers.id, input.id));

        for (const answer of input.answers) {
          await trx.insert(schema.formAnswer).values({
            field: answer.field,
            value: answer.value,
            customerFormId: input.id,
          });
        }
      });
    }),

  delete: protectedProcedure.input(z.number()).mutation(({ ctx, input }) => {
    if (!ctx.session?.user?.id) {
      throw new Error("User not authenticated");
    }
    return ctx.db.transaction(async (trx) => {
      await trx
        .delete(schema.formsToCustomers)
        .where(eq(schema.formsToCustomers.id, input));

      await trx
        .delete(schema.formAnswer)
        .where(eq(schema.formAnswer.customerFormId, input));
    });
  }),
});
