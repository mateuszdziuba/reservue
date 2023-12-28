import { z } from "zod";

import { desc, eq, schema } from "@reservue/db";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const bussinessRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    // return ctx.db.select().from(schema.bussiness).orderBy(desc(schema.bussiness.id));
    return ctx.db.query.bussiness.findMany({
      orderBy: desc(schema.bussiness.id),
      limit: 10,
    });
  }),

  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      // return ctx.db
      //   .select()
      //   .from(schema.bussiness)
      //   .where(eq(schema.bussiness.id, input.id));

      return ctx.db.query.bussiness.findFirst({
        where: eq(schema.bussiness.id, input.id),
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
      return ctx.db.insert(schema.bussiness).values(input);
    }),

  delete: protectedProcedure.input(z.number()).mutation(({ ctx, input }) => {
    return ctx.db
      .delete(schema.bussiness)
      .where(eq(schema.bussiness.id, input));
  }),
});
