import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { Link } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { Eye, MoreVertical, Trash } from "lucide-react-native";

import type { Form } from "@reservue/types";

import { CustomBottomSheetModal } from "~/app/components/custom-bottom-sheet-modal";
import { TabShell } from "~/app/components/tab-shell";
import { api } from "~/utils/api";
import { Spinner } from "../components/spinner";

const Forms = () => {
  const [data, setData] = useState<Form[]>([]);
  const [filter, setFilter] = useState("");
  const [activeItem, setActiveItem] = useState<Form | null>(null);
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const utils = api.useUtils();
  const formsQuery = api.form.byCreatorId.useQuery();
  const { mutateAsync: deleteForm } = api.form.delete.useMutation();

  useEffect(() => {
    if (!formsQuery?.data) return;
    setData(formsQuery.data as Form[]);
  }, [formsQuery?.data]);

  useEffect(() => {
    filterData(filter);
  }, [filter]);

  function filterData(filter: string) {
    const filtered =
      formsQuery.data?.filter(({ title }) => {
        return title.toLowerCase().includes(filter.toLowerCase());
      }) ?? [];
    setData(filtered as Form[]);
  }

  return (
    <>
      <TabShell title="Formularze" description="Zarządzaj formularzami">
        {formsQuery.isLoading ? (
          <Spinner className="h-8 w-8 self-center border-red-500 border-r-transparent" />
        ) : (
          <>
            <View className="h-full w-full">
              <FlashList
                data={data}
                estimatedItemSize={20}
                ItemSeparatorComponent={() => <View className="h-2" />}
                ListHeaderComponent={
                  data?.length > 0 ? (
                    <TextInput
                      className="mb-2 rounded bg-white p-2 text-black"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      placeholder="Szukaj formularza..."
                      onChangeText={setFilter}
                      value={filter}
                    />
                  ) : null
                }
                ListEmptyComponent={() => <Text>Brak danych.</Text>}
                renderItem={(p) => (
                  <View className="rounded bg-white p-4">
                    <View className="flex flex-row justify-between">
                      <Text className="text-lg font-semibold">
                        {p.item.title}
                      </Text>
                      <Pressable
                        onPress={() => {
                          setActiveItem(p.item);
                          bottomSheetRef.current?.present();
                        }}
                      >
                        <MoreVertical className="text-red-500/60" />
                      </Pressable>
                    </View>
                    <Text>{p.item.description}</Text>
                  </View>
                )}
              />
            </View>
          </>
        )}
        <CustomBottomSheetModal ref={bottomSheetRef}>
          <View className="gap-2 pb-8">
            <Link asChild href={`/forms/${activeItem?.id}/preview/`}>
              <Pressable
                className="flex flex-row items-center gap-2 rounded  p-2"
                onPress={() => bottomSheetRef.current?.close()}
              >
                <Eye className="text-black" />
                <Text>Podgląd</Text>
              </Pressable>
            </Link>
            <Pressable
              className="flex flex-row items-center gap-2 rounded bg-red-500/10 p-2"
              onPress={() =>
                Alert.alert(
                  "Uwaga!",
                  `Czy na pewno chcesz usunąć formularz ${activeItem?.title}?`,
                  [
                    { text: "Nie", style: "cancel", onPress: () => null },
                    {
                      text: "Tak",
                      style: "destructive",
                      // eslint-disable-next-line @typescript-eslint/no-misused-promises
                      onPress: async () => {
                        if (!activeItem) return;
                        try {
                          await deleteForm(activeItem.id);
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

export default Forms;
