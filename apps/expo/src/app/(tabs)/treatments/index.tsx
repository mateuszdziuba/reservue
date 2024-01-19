import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { MoreVertical, Trash } from "lucide-react-native";

import { CustomBottomSheetModal } from "~/app/components/custom-bottom-sheet-modal";
import { Status } from "~/app/components/status";
import { TabShell } from "~/app/components/tab-shell";
import { api } from "~/utils/api";

const Index = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("");
  const [activeItem, setActiveItem] = useState(null);
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const utils = api.useUtils();
  const customerFormsQuery = api.customerForm.all.useQuery();
  const { mutateAsync: deleteCustomerForm } =
    api.customerForm.delete.useMutation();

  useEffect(() => {
    if (!customerFormsQuery?.data) return;
    setData(customerFormsQuery.data);
  }, [customerFormsQuery?.data]);

  useEffect(() => {
    filterData(filter);
  }, [filter]);

  function filterData(filter) {
    const filtered = customerFormsQuery.data?.filter((item) => {
      const fullName = `${item.customer.lastName} ${item.customer.firstName}`;
      return fullName.toLowerCase().includes(filter.toLowerCase());
    });
    setData(filtered);
  }

  return (
    <>
      <TabShell title="Formularze" description="Zarządzaj formularzami">
        <TextInput
          className="mb-2 rounded bg-white p-2 text-black"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          placeholder="Szukaj formularza..."
          onChangeText={setFilter}
          value={filter}
        />
        <View className="h-full w-full">
          {data?.length > 0 ? (
            <FlashList
              data={data}
              estimatedItemSize={20}
              ItemeparatorComponent={() => <View className="h-2" />}
              renderItem={(p) => (
                <View className="gap-2 rounded bg-white p-4">
                  <View>
                    <View className="flex flex-row justify-between">
                      <Text className="text-lg font-semibold">
                        {p.item?.customer?.lastName}{" "}
                        {p.item?.customer?.firstName}
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
                    <Text>{p.item?.form?.title}</Text>
                  </View>
                  <View className="flex w-full flex-row justify-start">
                    <Status value={p.item?.status} />
                  </View>
                </View>
              )}
            />
          ) : (
            <Text>Brak danych.</Text>
          )}
        </View>
        <CustomBottomSheetModal ref={bottomSheetRef}>
          <View className="gap-2 pb-8">
            <Pressable
              className="flex flex-row items-center gap-2 rounded bg-red-500/10 p-2"
              onPress={() =>
                Alert.alert(
                  "Uwaga!",
                  `Czy na pewno chcesz usunąć formularz ${activeItem.form?.title} klienta ${activeItem.customer?.lastName} ${activeItem.customer?.firstName}?`,
                  [
                    { text: "Nie", style: "cancel", onPress: () => null },
                    {
                      text: "Tak",
                      style: "destructive",
                      onPress: async () => {
                        try {
                          await deleteCustomerForm(activeItem.id);
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
