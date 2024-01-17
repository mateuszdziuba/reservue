import { Text, View } from "react-native";

export function TabShell({ title, description, children }) {
  return (
    <View className="p-4">
      <View className="mb-4">
        <Text className="text-3xl font-semibold">{title}</Text>
        <Text className="text-xl text-black/60">{description}</Text>
      </View>
      {children}
    </View>
  );
}
