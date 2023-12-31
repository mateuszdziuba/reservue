import { authRouter } from "./router/auth";
import { businessRouter } from "./router/business";
import { customerRouter } from "./router/customer";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  business: businessRouter,
  customer: customerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
