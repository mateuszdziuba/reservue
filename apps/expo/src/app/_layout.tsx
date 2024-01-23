import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { TRPCProvider } from "~/utils/api";

import "../styles.css";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

const RootLayout = () => {
  return (
    <TRPCProvider>
      <BottomSheetModalProvider>
        <Stack screenOptions={{ headerTintColor: "#EF4444" }}>
          <Stack.Screen
            name="(auth)/signin"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="settings/index"
            options={{
              headerTitle: "Ustawienia",
              headerShadowVisible: false,
            }}
          />

          <Stack.Screen name="forms/[formId]/preview/index" />
          <Stack.Screen
            name="treatments/[treatmentId]/index"
            options={{
              headerTitle: "Wypełnij formularz",
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="treatments/[treatmentId]/fill"
            options={{
              headerTitle: "Wypełnij formularz",
              headerShadowVisible: false,
            }}
          />
        </Stack>
      </BottomSheetModalProvider>
      <StatusBar />
    </TRPCProvider>
  );
};

export default RootLayout;
