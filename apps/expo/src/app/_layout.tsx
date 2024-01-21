import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { TRPCProvider } from "~/utils/api";

import "../styles.css";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

// This is the main layout of the app
// It wraps your pages with the providers they need
const RootLayout = () => {
  return (
    <TRPCProvider>
      {/*
        The Stack component displays the current page.
        It also allows you to configure your screens 
      */}
      <BottomSheetModalProvider>
        <Stack screenOptions={{ headerTintColor: "#EF4444" }}>
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
          <Stack.Screen
            name="(auth)/signin"
            options={{
              headerShown: false,
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
