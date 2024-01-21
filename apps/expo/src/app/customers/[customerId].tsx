import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRef, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { Eye, MoreVertical, Trash } from "lucide-react-native";

import { api } from "~/utils/api";
import { CreateCustomerForm } from "../components/create-customer-form";
import { CustomBottomSheetModal } from "../components/custom-bottom-sheet-modal";

export default function CustomerPage() {
  const [activeItem, setActiveItem] = useState(null);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { customerId } = useLocalSearchParams();
  const { data } = api.customer.byId.useQuery({ id: Number(customerId) });
  const { data: formsData } = api.customerForm.byCustomerId.useQuery(
    Number(customerId),
  );

  const utils = api.useUtils();
  const { mutateAsync: deleteCustomerForm } =
    api.customerForm.delete.useMutation();

  return (
    <SafeAreaView>
      <ScrollView>
        <CreateCustomerForm defaultValues={data} />
        <View className="h-full w-full p-4">
          <FlashList
            data={formsData}
            estimatedItemSize={20}
            ItemSeparatorComponent={() => <View className="h-2" />}
            renderItem={(p) => (
              <View className="rounded bg-white p-4">
                <View className="flex flex-row justify-between">
                  <Text className="text-lg font-semibold">
                    {p.item.form.title}
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
      </ScrollView>
    </SafeAreaView>
  );
}
