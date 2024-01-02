import { z } from "zod";

import { and, desc, eq, schema } from "@reservue/db";
import { createBusinessSchema } from "@reservue/validators";

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

  byOwnerId: protectedProcedure.query(({ ctx }) => {
    // return ctx.db.select().from(schema.business).orderBy(desc(schema.business.id));
    return ctx.db.query.business.findFirst({
      where: eq(schema.business.ownerId, ctx.session.user.id),
    });
  }),

  create: protectedProcedure
    .input(createBusinessSchema)
    .mutation(({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      return ctx.db
        .insert(schema.business)
        .values({ ...input, ownerId: ctx.session.user.id });
    }),

  delete: protectedProcedure.input(z.number()).mutation(({ ctx, input }) => {
    if (!ctx.session?.user?.id) {
      throw new Error("User not authenticated");
    }
    return ctx.db
      .delete(schema.business)
      .where(
        and(
          eq(schema.business.id, input),
          eq(schema.business.ownerId, ctx.session.user.id),
        ),
      );
  }),
});
