import { z } from "zod";

import { and, desc, eq, schema } from "@reservue/db";
import { createCustomerSchema } from "@reservue/validators";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const customerRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    // return ctx.db.select().from(schema.post).orderBy(desc(schema.post.id));
    return ctx.db.query.customer.findMany({
      orderBy: desc(schema.customer.id),
      limit: 10,
    });
  }),

  byId: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      return ctx.db.query.customer.findFirst({
        where: eq(schema.customer.id, input.id),
      });
    }),

  byCreatorId: protectedProcedure.query(({ ctx }) => {
    if (!ctx.session?.user?.id) {
      throw new Error("User not authenticated");
    }

    return ctx.db.query.customer.findMany({
      where: eq(schema.customer.createdBy, ctx.session.user.id),
    });
  }),

  create: protectedProcedure
    .input(createCustomerSchema)
    .mutation(({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      return ctx.db
        .insert(schema.customer)
        .values({ ...input, createdBy: ctx.session.user.id });
    }),

  update: protectedProcedure
    .input(z.object({ id: z.number(), data: createCustomerSchema }))
    .mutation(({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      return ctx.db
        .update(schema.customer)
        .set(input.data)
        .where(
          and(
            eq(schema.customer.id, input.id),
            eq(schema.customer.createdBy, ctx.session.user.id),
          ),
        );
    }),

  delete: protectedProcedure.input(z.number()).mutation(({ ctx, input }) => {
    if (!ctx.session?.user?.id) {
      throw new Error("User not authenticated");
    }
    return ctx.db
      .delete(schema.customer)
      .where(
        and(
          eq(schema.customer.id, input),
          eq(schema.customer.createdBy, ctx.session.user.id),
        ),
      );
  }),
});
