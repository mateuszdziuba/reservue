import { Button, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Book } from "lucide-react-native";

import { useSignIn } from "~/utils/auth";

export default function Login() {
  const signIn = useSignIn();

  return (
    <SafeAreaView className="bg-red-500">
      <View className="h-full items-center justify-center">
        <Book className="text-white" size={64} />
        <Text className="text-5xl font-semibold text-white">reservue</Text>
        <Pressable
          onPress={signIn}
          className="mt-4 rounded  bg-white px-6 py-3 font-semibold "
        >
          <Text className="text-2xl font-semibold text-red-500">
            Zaloguj się
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
