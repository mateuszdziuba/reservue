import React from "react";
import { Button, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { FlashList } from "@shopify/flash-list";

import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";

function PostCard(props: {
  customer: RouterOutputs["customer"]["all"][number];
  onDelete: () => void;
}) {
  return (
    <View className="flex flex-row rounded-lg bg-white/10 p-4">
      <View className="flex-grow">
        <Link
          asChild
          href={{
            pathname: "/customers/[id]",
            params: { id: props.customer.id },
          }}
        >
          <Pressable>
            <Text className="text-xl font-semibold text-pink-400">
              {props.customer.firstName}
            </Text>
            <Text className="mt-2 text-white">{props.customer.lastName}</Text>
          </Pressable>
        </Link>
      </View>
      <Pressable onPress={props.onDelete}>
        <Text className="font-bold uppercase text-pink-400">Delete</Text>
      </Pressable>
    </View>
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
      <Pressable
        className="bg-primary rounded p-2"
        onPress={() => {
          mutate({
            title,
            content,
          });
        }}
      >
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

  const deletePostMutation = api.customer.delete.useMutation({
    onSettled: () => utils.customer.all.invalidate(),
  });

  return (
    <SafeAreaView className="bg-[#1F104A]">
      {/* <SignedOut> */}
      {/* <View className="h-full w-full p-4">
            <Text className="pb-2 text-center text-5xl font-bold text-white">
              reservue
            </Text>

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
                <PostCard
                  customer={p.item}
                  onDelete={() => deletePostMutation.mutate(p.item.id)}
                />
              )}
            />

            <CreatePost />
          </View> */}
      {/* </SignedOut> */}
      {/* <SignedIn> */}
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Home Page" }} />
      <View className="h-full w-full p-4">
        <Text className="pb-2 text-center text-5xl font-bold text-white">
          reservue
        </Text>

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
            <PostCard
              customer={p.item}
              onDelete={() => deletePostMutation.mutate(p.item.id)}
            />
          )}
        />

        <CreatePost />
      </View>
      {/* </SignedIn> */}
    </SafeAreaView>
  );
};

export default Index;
