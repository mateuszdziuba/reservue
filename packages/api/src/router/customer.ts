import { z } from "zod";

import { and, desc, eq, schema } from "@reservue/db";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const customerRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    // return ctx.db.select().from(schema.post).orderBy(desc(schema.post.id));
    return ctx.db.query.customer.findMany({
      orderBy: desc(schema.customer.id),
      limit: 10,
    });
  }),

  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      // return ctx.db
      //   .select()
      //   .from(schema.customer)
      //   .where(eq(schema.customer.id, input.id));

      return ctx.db.query.customer.findFirst({
        where: eq(schema.customer.id, input.id),
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        phoneNumber: z.string().min(1),
        email: z.string().min(1).email(),
      }),
    )
    .mutation(({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      return ctx.db
        .insert(schema.customer)
        .values({ ...input, createdBy: ctx.session.user.id });
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
