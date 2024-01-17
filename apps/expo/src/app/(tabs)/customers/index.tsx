import React, { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { MoreVertical } from "lucide-react-native";

import { TabShell } from "~/app/components/tab-shell";
import { api } from "~/utils/api";
import { useSignIn, useSignOut, useUser } from "~/utils/auth";

function CreatePost() {
  const utils = api.useUtils();

  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");

  const { mutate, error } = api.customer.create.useMutation({
    async onSuccess() {
      setTitle("");
      setContent("");
    },
  });

  return (
    <View className="mt-4">
      <TextInput
        className="mb-2 rounded bg-white/10 p-2 text-white"
        placeholderTextColor="rgba(255, 255, 255, 0.5)"
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
      />
      {error?.data?.zodError?.fieldErrors.title && (
        <Text className="mb-2 text-red-500">
          {error.data.zodError.fieldErrors.title}
        </Text>
      )}
      <TextInput
        className="mb-2 rounded bg-white/10 p-2 text-white"
        placeholderTextColor="rgba(255, 255, 255, 0.5)"
        value={content}
        onChangeText={setContent}
        placeholder="Content"
      />
      {error?.data?.zodError?.fieldErrors.content && (
        <Text className="mb-2 text-red-500">
          {error.data.zodError.fieldErrors.content}
        </Text>
      )}
      <Pressable className="bg-primary rounded p-2" onPress={null}>
        <Text className="font-semibold text-white">Publish post</Text>
      </Pressable>
      {error?.data?.code === "UNAUTHORIZED" && (
        <Text className="mt-2 text-red-500">
          You need to be logged in to create a post
        </Text>
      )}
    </View>
  );
}

const Index = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("");

  const customersQuery = api.customer.byCreatorId.useQuery();

  useEffect(() => {
    if (!customersQuery?.data) return;
    setData(customersQuery.data);
  }, [customersQuery?.data]);

  useEffect(() => {
    filterData(filter);
  }, [filter]);

  function filterData(filter) {
    const filtered = customersQuery.data?.filter((item) => {
      const fullName = `${item.lastName} ${item.firstName}`;
      return fullName.toLowerCase().includes(filter.toLowerCase());
    });
    setData(filtered);
  }

  return (
    <>
      <TabShell title="Klienci" description="Zarządzaj klientami">
        <TextInput
          className="mb-2 rounded bg-white p-2 text-black"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          placeholder="Szukaj klienta..."
          onChangeText={setFilter}
          value={filter}
        />
        <View className="h-full w-full">
          <FlashList
            data={data}
            estimatedItemSize={20}
            ItemSeparatorComponent={() => <View className="h-2" />}
            renderItem={(p) => (
              <View className="rounded bg-white p-4">
                <View className="flex flex-row justify-between">
                  <Text className="text-lg font-semibold">
                    {p.item.lastName} {p.item.firstName}
                  </Text>
                  <Pressable>
                    <MoreVertical className="text-red-500/60" />
                  </Pressable>
                </View>
                <Text>{p.item.email}</Text>
                <Text>{p.item.phoneNumber}</Text>
              </View>
            )}
          />
        </View>
      </TabShell>
    </>
  );
};

export default Index;
