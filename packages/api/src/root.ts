import { authRouter } from "./router/auth";
import { businessRouter } from "./router/business";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  business: businessRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
