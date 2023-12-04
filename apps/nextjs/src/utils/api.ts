import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "@reservue/api";

export const api = createTRPCReact<AppRouter>();

export { type RouterInputs, type RouterOutputs } from "@reservue/api";
