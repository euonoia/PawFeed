import React from "react";
import { View, Text, SafeAreaView, TouchableOpacity, Linking } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/theme/useTheme";

export default function OpenConfigPage() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, padding: 30, backgroundColor: theme.surface }}>
      <Text style={{ fontSize: 14, fontWeight: "700", color: theme.text }}>STEP 3 OF 3</Text>
      <Text style={{ fontSize: 28, fontWeight: "800", color: theme.text, marginVertical: 20 }}>Configure Device</Text>

      <Text style={{ fontSize: 16, color: theme.text }}>
        Open the setup page (192.168.4.1) in your browser and select your home Wi-Fi.
      </Text>

      <TouchableOpacity
        onPress={() => Linking.openURL("http://192.168.4.1")}
        style={{ marginVertical: 20, padding: 16, borderWidth: 1, borderRadius: 12, alignItems: "center" }}
      >
        <Text style={{ color: theme.primary }}>Open Setup Page</Text>
        <Text style={{ fontSize: 12 }}>http://192.168.4.1</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ padding: 16, borderRadius: 16, backgroundColor: theme.primary, alignItems: "center" }}
        onPress={() => router.push("/_setup/VerifyConnection")}
      >
        <Text style={{ color: "#FFF", fontWeight: "700" }}>I've Finished Setup</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
