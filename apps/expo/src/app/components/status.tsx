import { Text, View } from "react-native";

export function Status({ value }: { value: 0 | 1 | 2 }) {
  const borderColor =
    value === 0
      ? "border-gray-500"
      : value === 1
        ? "border-yellow-500"
        : "border-green-500";

  const textColor =
    value === 0
      ? "text-gray-500"
      : value === 1
        ? "text-yellow-500"
        : "text-green-500";

  const text =
    value === 0
      ? "Przypisany do klienta"
      : value === 1
        ? "W trakcie"
        : "Ukończony";

  return (
    <View className={`rounded-full border px-2 py-1 ${borderColor}`}>
      <Text className={textColor}>{text}</Text>
    </View>
  );
}
