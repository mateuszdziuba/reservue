import { Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";

import { api } from "~/utils/api";
import { FormPreview } from "./form-preview";

export default function Preview() {
  const { formId } = useLocalSearchParams();

  const { data } = api.form.byId.useQuery({ formId: String(formId) });
  console.log(data);

  return <View>{data && <FormPreview data={data} />}</View>;
}
