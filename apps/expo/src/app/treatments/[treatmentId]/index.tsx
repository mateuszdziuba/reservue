import { View } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";

import { api } from "~/utils/api";

export default function CustomerFormPage() {
  const { treatmentId } = useLocalSearchParams();
  const { data } = api.customerForm.byId.useQuery(Number(treatmentId));

  return (
    <View>
      {data?.status === 2 ? (
        <p>Formularz został juz uzupełniony</p>
      ) : (
        <Link href={`/treatments/${treatmentId}/fill`}>
          ROZPOCZNIJ UZUPEŁNIANIE FORMULARZA
        </Link>
      )}
    </View>
  );
}
