import { authRouter } from "./router/auth";
import { bussinessRouter } from "./router/bussiness";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  bussiness: bussinessRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
