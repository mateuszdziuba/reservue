import { View } from "react-native";

export function Spinner() {
  return (
    <View
      className="border-background h-full w-full animate-spin rounded-full border-2 border-r-transparent"
      role="status"
    />
  );
}
