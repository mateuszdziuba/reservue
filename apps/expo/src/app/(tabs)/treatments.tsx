import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Modal, Pressable, Text, TextInput, View } from "react-native";
import { Link } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { Eye, MoreVertical, Pen, Trash } from "lucide-react-native";

import type { CustomerForm } from "~/utils/types";
import { CustomBottomSheetModal } from "~/app/components/custom-bottom-sheet-modal";
import { Status } from "~/app/components/status";
import { TabShell } from "~/app/components/tab-shell";
import { api } from "~/utils/api";
import { CreateTreatmentForm } from "../components/create-treatment-form";
import { Spinner } from "../components/spinner";

const Index = () => {
  const [data, setData] = useState<CustomerForm[]>([]);
  const [filter, setFilter] = useState("");
  const [activeItem, setActiveItem] = useState<CustomerForm | null>(null);
  const [isVisible, setIsVisible] = useState(false);
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

  function filterData(filter: string) {
    const filtered =
      customerFormsQuery.data?.filter((item) => {
        const fullName = `${item.customer.lastName} ${item.customer.firstName}`;
        return fullName.toLowerCase().includes(filter.toLowerCase());
      }) ?? [];
    setData(filtered);
  }

  return (
    <>
      <TabShell title="Formularze" description="Zarządzaj formularzami">
        <Pressable
          onPress={() => setIsVisible(true)}
          className="mb-2 flex flex-row items-center gap-2 self-start rounded bg-red-500 p-3 font-semibold"
        >
          <Pen className=" text-white" />
          <Text className="text-lg font-semibold text-white">
            Wypełnij formularz
          </Text>
        </Pressable>
        {customerFormsQuery.isLoading ? (
          <Spinner className="h-8 w-8 border-red-500 border-r-transparent" />
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
                      <Status value={p.item?.status as 0 | 1 | 2} />
                    </View>
                  </View>
                )}
              />
            </View>
          </>
        )}
        <CustomBottomSheetModal ref={bottomSheetRef}>
          <View className="gap-2 pb-8">
            <Link asChild href={`/treatments/${activeItem?.id}/view`}>
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
                  `Czy na pewno chcesz usunąć formularz ${activeItem?.form?.title} klienta ${activeItem?.customer?.lastName} ${activeItem?.customer?.firstName}?`,
                  [
                    { text: "Nie", style: "cancel", onPress: () => null },
                    {
                      text: "Tak",
                      style: "destructive",
                      // eslint-disable-next-line @typescript-eslint/no-misused-promises
                      onPress: async () => {
                        if (!activeItem) return;
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
        <Modal animationType="slide" visible={isVisible}>
          <CreateTreatmentForm setIsVisible={setIsVisible} />
        </Modal>
      </TabShell>
    </>
  );
};

export default Index;
