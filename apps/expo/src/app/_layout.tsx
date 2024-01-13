import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { TRPCProvider } from "~/utils/api";

import "../styles.css";

import Constants from "expo-constants";
import { ClerkProvider } from "@clerk/clerk-expo";

// This is the main layout of the app
// It wraps your pages with the providers they need
const RootLayout = () => {
  return (
    <TRPCProvider>
      {/*
        The Stack component displays the current page.
        It also allows you to configure your screens 
      */}
      <ClerkProvider
        publishableKey={Constants.expoConfig?.extra?.clerkPublishableKey}
      >
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: "#f472b6",
            },
          }}
        />
        <StatusBar />
      </ClerkProvider>
    </TRPCProvider>
  );
};

export default RootLayout;
