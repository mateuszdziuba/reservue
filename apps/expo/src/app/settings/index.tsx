import { Pressable, SafeAreaView, Text, View } from "react-native";
import { router } from "expo-router";
import { LogOut } from "lucide-react-native";

import { api } from "~/utils/api";
import { useSignOut } from "~/utils/auth";

export default function Settings() {
  const signOut = useSignOut();
  const utils = api.useUtils();

  return (
    <SafeAreaView className="bg-white">
      <View className="flex h-full flex-col items-center  p-4">
        <Pressable
          onPress={async () => {
            await signOut();
            await utils.auth.invalidate();
            router.push("/(auth)/signin");
          }}
          className="flex w-full flex-row items-center gap-4 rounded bg-red-300/40 p-4 font-semibold"
        >
          <LogOut className="text-5xl text-red-500" />
          <Text className="text-2xl font-semibold text-red-500">
            Wyloguj się
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
