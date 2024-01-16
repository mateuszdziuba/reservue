import { useEffect } from "react";
import { Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect } from "expo-router";

import { useSignIn, useSignOut, useUser } from "~/utils/auth";

export default function Login() {
  const user = useUser();
  const signIn = useSignIn();
  const signOut = useSignOut();

  return (
    <SafeAreaView>
      <View>
        <Button
          onPress={() => (user ? signOut() : signIn())}
          title={user ? "Sign Out" : "Sign In With Discord"}
          color={"#5B65E9"}
        />
      </View>
    </SafeAreaView>
  );
}
