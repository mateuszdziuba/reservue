import { View } from "react-native";

import { cn } from "~/utils/utils";

export function Spinner({ className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <View
      className={cn(
        "border-background h-3 w-3 animate-spin rounded-full border-2 border-r-transparent",
        className,
      )}
      role="status"
    />
  );
}
