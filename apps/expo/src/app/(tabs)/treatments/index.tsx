import type BottomSheet from "@gorhom/bottom-sheet";
import type {
  BottomSheetBackdropProps,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import { Eye, MoreVertical, Trash } from "lucide-react-native";

import { CustomBottomSheetModal } from "~/app/components/custom-bottom-sheet-modal";
import { Status } from "~/app/components/status";
import { TabShell } from "~/app/components/tab-shell";
import { api } from "~/utils/api";

const Index = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("");
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const customerFormsQuery = api.customerForm.all.useQuery();

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
          <FlashList
            data={data}
            estimatedItemSize={20}
            ItemSeparatorComponent={() => <View className="h-2" />}
            renderItem={(p) => (
              <View className="gap-2 rounded bg-white p-4">
                <View>
                  <View className="flex flex-row justify-between">
                    <Text className="text-lg font-semibold">
                      {p.item.customer.lastName} {p.item.customer.firstName}
                    </Text>
                    <Pressable
                      onPress={() => bottomSheetRef.current?.present()}
                    >
                      <MoreVertical className="text-red-500/60" />
                    </Pressable>
                  </View>
                  <Text>{p.item.form.title}</Text>
                </View>
                <View className="flex w-full flex-row justify-start">
                  <Status value={p.item.status} />
                </View>
              </View>
            )}
          />
        </View>
        <CustomBottomSheetModal ref={bottomSheetRef}>
          <View className="gap-2 pb-8">
            <Pressable className="flex flex-row items-center gap-2 rounded p-2">
              <Eye className="text-black" />
              <Text>Podgląd</Text>
            </Pressable>
            <Pressable className="flex flex-row items-center gap-2 rounded bg-red-500/10 p-2">
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
