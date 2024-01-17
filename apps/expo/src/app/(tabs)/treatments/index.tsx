import React, { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { MoreVertical } from "lucide-react-native";

import { Status } from "~/app/components/status";
import { TabShell } from "~/app/components/tab-shell";
import { api } from "~/utils/api";

const Index = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("");

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
                    <Pressable>
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
      </TabShell>
    </>
  );
};

export default Index;
