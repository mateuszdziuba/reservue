import type { ReactNode } from "react";

export function FormWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-lg rounded-md border p-4">{children}</div>
  );
}
