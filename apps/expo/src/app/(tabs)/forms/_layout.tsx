import React from "react";
import { Stack } from "expo-router";

// This is the main layout of the app
// It wraps your pages with the providers they need
const FormsLayout = () => {
  return (
    <Stack screenOptions={{ headerTintColor: "#EF4444", headerShown: false }}>
      <Stack.Screen
        name="[formId]/preview/index"
        options={{ headerShown: true }}
      />
    </Stack>
  );
};

export default FormsLayout;
