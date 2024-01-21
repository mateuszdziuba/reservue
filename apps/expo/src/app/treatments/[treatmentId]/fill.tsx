import { useEffect } from "react";
import { ScrollView, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

import type { Form } from "~/utils/types";
import { FormPreview } from "~/app/forms/[formId]/preview/_components/form-preview";
import { api } from "~/utils/api";

export default function CustomerFormPage() {
  const { treatmentId } = useLocalSearchParams();

  const { data } = api.customerForm.byId.useQuery(Number(treatmentId));
  const { data: formData } = api.form.byId.useQuery({
    formId: String(data?.formId),
  });
  const { mutateAsync: updateStatus } =
    api.customerForm.updateStatus.useMutation();

  useEffect(() => {
    if (data?.status === 0) {
      updateStatus({ id: Number(treatmentId), status: 1 });
    }
  }, [data?.status]);

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
