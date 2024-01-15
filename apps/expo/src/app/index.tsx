import React from "react";
import { Button, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, Stack } from "expo-router";
import { FlashList } from "@shopify/flash-list";

import { api } from "~/utils/api";
import { useSignIn, useSignOut, useUser } from "~/utils/auth";

function MobileAuth() {
  const user = useUser();
  const signIn = useSignIn();
  const signOut = useSignOut();

  return (
    <>
      <Text className="pb-2 text-center text-xl font-semibold text-white">
        {user?.name ?? "Not logged in"}
      </Text>
      <Button
        onPress={() => (user ? signOut() : signIn())}
        title={user ? "Sign Out" : "Sign In With Discord"}
        color={"#5B65E9"}
      />
      <Button onPress={signOut} title={"Sign Out"} color={"#5B65E9"} />
      <Link href="/login">Login</Link>
    </>
  );
}

function CreatePost() {
  const utils = api.useUtils();

  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");

  const { mutate, error } = api.customer.create.useMutation({
    async onSuccess() {
      setTitle("");
      setContent("");
      await utils.customer.all.invalidate();
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
      <Pressable className="bg-primary rounded p-2" onPress={console.log}>
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

  const postQuery = api.customer.all.useQuery();
  console.log(postQuery.data);

  return (
    <SafeAreaView style={{ backgroundColor: "#1F104A" }}>
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Home Page" }} />
      <View className="h-full w-full p-4">
        <Text className="pb-2 text-center text-5xl font-bold text-white">
          Create <Text className="text-pink-400">T3</Text> Turbo
        </Text>

        <MobileAuth />

        <Button
          onPress={() => void utils.customer.all.invalidate()}
          title="Refresh posts"
          color={"#f472b6"}
        />

        <View className="py-2">
          <Text className="font-semibold italic text-white">
            Press on a post
          </Text>
        </View>
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
        <CreatePost />
      </View>
    </SafeAreaView>
  );
};

export default Index;
