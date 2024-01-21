import React from "react";
import { SafeAreaView, Text, View } from "react-native";
import { ClipboardEdit, FileStack, Sticker, Users } from "lucide-react-native";

import { api } from "~/utils/api";
import { TabShell } from "../components/tab-shell";

const Index = () => {
  const { data } = api.business.getStats.useQuery();

  const stats = [
    {
      title: "Liczba klientów",
      value: data?.customerCount,
      icon: Users,
    },
    {
      title: "Dodane formularze",
      value: 14,
      icon: FileStack,
    },
    { title: "Wypełnione formularze", value: 45, icon: ClipboardEdit },
    { title: "Oszczędzone kartki papieru", value: 52, icon: Sticker },
  ];

  return (
    <SafeAreaView>
      <TabShell title="Dashboard" description="Welcome to your dashboard">
        <View className="h-full w-full gap-2">
          {stats.map((stat, index) => (
            <View key={index} className="rounded bg-white p-4">
              <View className="flex flex-row justify-between">
                <Text className="text-lg font-medium">{stat.title}</Text>
                <stat.icon className="text-black" />
              </View>
              <Text className="text-3xl font-bold">{stat.value}</Text>
            </View>
          ))}
        </View>
      </TabShell>
    </SafeAreaView>
  );
};

export default Index;
