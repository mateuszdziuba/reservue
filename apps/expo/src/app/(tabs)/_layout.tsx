import React from "react";
import { Image, Pressable, View } from "react-native";
import { Link, Tabs } from "expo-router";
import {
  BarChart,
  ClipboardEdit,
  HeartHandshake,
  Users,
} from "lucide-react-native";

import { useUser } from "~/utils/auth";

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function TabsLayout() {
  const user = useUser();

  return (
    <Tabs
      screenOptions={{
        headerRight: () => (
          <View className="flex w-full items-end pr-8">
            <Link href="/settings/" asChild>
              <Pressable className="h-10 w-10">
                <Image
                  className="h-full w-full rounded-full "
                  source={{ uri: user?.image! }}
                  // placeholder={blurhash}
                />
              </Pressable>
            </Link>
          </View>
        ),
        headerShadowVisible: false,
        headerTitle: "",
        tabBarActiveTintColor: "#EF4444",
        tabBarStyle: {
          elevation: 0,
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: (props) => <BarChart {...props} />,
          tabBarLabel: "Dashboard",
        }}
      />
      <Tabs.Screen
        name="treatments"
        options={{
          tabBarIcon: (props) => <HeartHandshake {...props} />,
          tabBarLabel: "Zabiegi",
        }}
      />
      <Tabs.Screen
        name="customers"
        options={{
          tabBarIcon: (props) => <Users {...props} />,
          tabBarLabel: "Klienci",
        }}
      />
      <Tabs.Screen
        name="forms"
        options={{
          tabBarIcon: (props) => <ClipboardEdit {...props} />,
          tabBarLabel: "Formularze",
        }}
      />
    </Tabs>
  );
}
