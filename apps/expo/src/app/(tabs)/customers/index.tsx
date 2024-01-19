import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { MoreVertical, Trash } from "lucide-react-native";

import { CustomBottomSheetModal } from "~/app/components/custom-bottom-sheet-modal";
import { TabShell } from "~/app/components/tab-shell";
import { api } from "~/utils/api";

function CreatePost() {
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");

  const utils = api.useUtils();
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
  const [activeItem, setActiveItem] = React.useState();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const utils = api.useUtils();
  const customersQuery = api.customer.byCreatorId.useQuery();
  const { mutateAsync: deleteCustomer } = api.customer.delete.useMutation();

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
                  <Pressable
                    onPress={() => {
                      bottomSheetRef.current?.present();
                      setActiveItem(p.item);
                    }}
                  >
                    <MoreVertical className="text-red-500/60" />
                  </Pressable>
                </View>
                <Text>{p.item.email}</Text>
                <Text>{p.item.phoneNumber}</Text>
              </View>
            )}
          />
        </View>
        <CustomBottomSheetModal ref={bottomSheetRef}>
          <View className="gap-2 pb-8">
            <Pressable
              className="flex flex-row items-center gap-2 rounded bg-red-500/10 p-2"
              onPress={() =>
                Alert.alert(
                  "Uwaga!",
                  `Czy na pewno chcesz usunąć klienta ${activeItem.lastName} ${activeItem.firstName}?`,
                  [
                    { text: "Nie", style: "cancel", onPress: () => null },
                    {
                      text: "Tak",
                      style: "destructive",
                      onPress: async () => {
                        try {
                          await deleteCustomer(activeItem.id);
                          await utils.invalidate();
                          setActiveItem(null);
                          bottomSheetRef.current?.close();
                        } catch (error) {
                          console.log(error);
                        }
                      },
                    },
                  ],
                )
              }
            >
              <Trash className="text-red-500" />
              <Text className="text-red-500">Usuń</Text>
            </Pressable>
          </View>
        </CustomBottomSheetModal>
      </TabShell>
    </>
  );
};

export default Index;
