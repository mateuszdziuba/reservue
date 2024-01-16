import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { api } from "~/utils/api";

const Index = () => {
  // if (!user) return <Redirect href="/login" />;

  return (
    <SafeAreaView>
      <View className="h-full w-full p-4">
        <Text>Dashboard</Text>
      </View>
    </SafeAreaView>
  );
};

export default Index;
