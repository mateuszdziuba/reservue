import React from "react";
import { Tabs } from "expo-router";
import {
  BarChart,
  ClipboardEdit,
  HeartHandshake,
  Users,
} from "lucide-react-native";

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: (props) => <BarChart {...props} />,
          tabBarLabel: "Dashboard",
        }}
      />
      <Tabs.Screen
        name="treatments/index"
        options={{
          tabBarIcon: (props) => <HeartHandshake {...props} />,
          tabBarLabel: "Zabiegi",
        }}
      />
      <Tabs.Screen
        name="customers/index"
        options={{
          tabBarIcon: (props) => <Users {...props} />,
          tabBarLabel: "Klienci",
        }}
      />
      <Tabs.Screen
        name="forms/index"
        options={{
          tabBarIcon: (props) => <ClipboardEdit {...props} />,
          tabBarLabel: "Formularze",
        }}
      />
    </Tabs>
  );
}
