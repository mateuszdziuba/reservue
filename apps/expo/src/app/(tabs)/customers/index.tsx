import React from "react";
import { Button, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, Redirect, Stack, Tabs } from "expo-router";
import { FlashList } from "@shopify/flash-list";

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
  const utils = api.useUtils();

  const user = useUser();
  const postQuery = api.customer.byCreatorId.useQuery();
  console.log(postQuery.data);
  // if (!user) return <Redirect href="/login" />;

  return (
    <SafeAreaView style={{ backgroundColor: "#1F104A" }}>
      {/* Changes page title visible on the header */}
      <View className="h-full w-full p-4">
        <Text className="pb-2 text-center text-5xl font-bold text-white">
          Customers
        </Text>

        <Button title="Refresh posts" color={"#f472b6"} />

        <FlashList
          data={postQuery.data}
          estimatedItemSize={20}
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderItem={(p) => (
            <Text>
              {p.item.firstName} {p.item.lastName}
            </Text>
          )}
        />
        <Pressable
          className="bg-primary rounded p-2"
          onPress={() => utils.customer.byCreatorId.invalidate()}
        >
          <Text>Refresh</Text>
        </Pressable>
        <CreatePost />
      </View>
    </SafeAreaView>
  );
};

export default Index;
