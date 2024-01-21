import { SafeAreaView } from "react-native";
import { useLocalSearchParams } from "expo-router";

import type { Form } from "~/utils/types";
import { api } from "~/utils/api";
import { FormPreview } from "./_components/form-preview";

export default function Preview() {
  const { formId } = useLocalSearchParams();

  const { data } = api.form.byId.useQuery({ formId: String(formId) });

  return (
    <SafeAreaView>{data && <FormPreview data={data as Form} />}</SafeAreaView>
  );
}
