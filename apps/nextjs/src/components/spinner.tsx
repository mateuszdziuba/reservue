import { cn } from "~/lib/utils";

export function Spinner({ className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "border-background h-3 w-3 animate-spin rounded-full border-2 border-r-transparent",
        className,
      )}
      role="status"
    />
  );
}
