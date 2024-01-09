import { authRouter } from "./router/auth";
import { businessRouter } from "./router/business";
import { customerRouter } from "./router/customer";
import { customerFormRouter } from "./router/customer-form";
import { formRouter } from "./router/form";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  business: businessRouter,
  customer: customerRouter,
  form: formRouter,
  customerForm: customerFormRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
