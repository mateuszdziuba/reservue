import { z } from "zod";

import { desc, eq, schema } from "@reservue/db";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const businessRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    // return ctx.db.select().from(schema.business).orderBy(desc(schema.business.id));
    return ctx.db.query.business.findMany({
      orderBy: desc(schema.business.id),
      limit: 10,
    });
  }),

  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      // return ctx.db
      //   .select()
      //   .from(schema.business)
      //   .where(eq(schema.business.id, input.id));

      return ctx.db.query.business.findFirst({
        where: eq(schema.business.id, input.id),
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(schema.business).values(input);
    }),

  delete: protectedProcedure.input(z.number()).mutation(({ ctx, input }) => {
    return ctx.db.delete(schema.business).where(eq(schema.business.id, input));
  }),
});
