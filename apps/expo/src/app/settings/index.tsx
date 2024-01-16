import { Button, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { api } from "~/utils/api";
import { useSignOut } from "~/utils/auth";

export default function Settings() {
  const signOut = useSignOut();
  const utils = api.useUtils();

  return (
    <SafeAreaView className=" bg-red-500">
      <View className="flex h-full flex-col items-center  p-4">
        <Pressable
          onPress={async () => {
            await signOut();
            await utils.auth.invalidate();
            router.push("/(auth)/signin");
          }}
          className="w-full rounded bg-white/40 p-4 font-semibold"
        >
          <Text className="text-2xl font-semibold text-white">Wyloguj się</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
