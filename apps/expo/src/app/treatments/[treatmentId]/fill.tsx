import { ScrollView, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { FormPreview } from "~/app/forms/[formId]/preview/_components/form-preview";
import { api } from "~/utils/api";

export default function CustomerFormPage() {
  const { treatmentId } = useLocalSearchParams();

  const { data } = api.customerForm.byId.useQuery(Number(treatmentId));
  const { data: formData } = api.form.byId.useQuery({
    formId: String(data?.formId),
  });
  //   if (data?.status === 0) {
  //     api.customerForm.updateStatus.useMutation({
  //       id: Number(params.treatmentId),
  //       status: 1,
  //     });
  //   }

  return (
    <ScrollView className=" flex flex-col pt-4">
      {data && formData && (
        <>
          <Text className="text-base">{`Klient: ${data?.customer.firstName} ${data?.customer.lastName}`}</Text>
          {data?.status === 2 ? (
            <Text className="text-2xl">Formularz został ju wypełniony</Text>
          ) : (
            <FormPreview data={formData as Form} isSubmitEnabled />
          )}
        </>
      )}
    </ScrollView>
  );
}
