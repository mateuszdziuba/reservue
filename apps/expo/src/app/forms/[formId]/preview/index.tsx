import { SafeAreaView, Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";

import { api } from "~/utils/api";
import { FormPreview } from "./_components/form-preview";

export default function Preview() {
  const { formId } = useLocalSearchParams();

  const { data } = api.form.byId.useQuery({ formId: String(formId) });

  return <SafeAreaView>{data && <FormPreview data={data} />}</SafeAreaView>;
}
