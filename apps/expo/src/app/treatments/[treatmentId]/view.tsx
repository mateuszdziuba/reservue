import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import type { Form } from "~/utils/types";
import { Spinner } from "~/app/components/spinner";
import { FormPreview } from "~/app/forms/[formId]/preview/_components/form-preview";
import { api } from "~/utils/api";

export default function TreatmentView() {
  const { treatmentId } = useLocalSearchParams();

  const { data: customerFormData, isLoading: isCustomersDataLoading } =
    api.customerForm.byId.useQuery(Number(treatmentId));
  const { data: formData, isLoading: isFormDataLoading } =
    api.form.byId.useQuery({
      formId: String(customerFormData?.formId),
    });
  const { data: answersData, isLoading: isAnswersDataLoading } =
    api.customerForm.getAnswers.useQuery(Number(treatmentId));

  const isLoading =
    isCustomersDataLoading || isFormDataLoading || isAnswersDataLoading;

  const defaultValues = answersData?.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.field]: JSON.parse(curr.value),
    };
  }, {});

  return (
    <>
      {isLoading ? (
        <View className="flex h-16 w-16 flex-1 items-center justify-center">
          <Spinner />
        </View>
      ) : (
        <FormPreview data={formData as Form} defaultValues={defaultValues} />
      )}
    </>
  );
}
