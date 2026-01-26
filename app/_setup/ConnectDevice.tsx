import React from "react";
import { View, Text, SafeAreaView, TouchableOpacity, Clipboard } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/theme/useTheme";

export default function ConnectDevice() {
  const router = useRouter();
  const theme = useTheme();

  const copyToClipboard = () => {
    Clipboard.setString("pawfeed@admin");
    alert("Password copied!");
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 30, backgroundColor: theme.surface }}>
      <Text style={{ fontSize: 14, fontWeight: "700", color: theme.text }}>STEP 2 OF 3</Text>
      <Text style={{ fontSize: 28, fontWeight: "800", color: theme.text, marginVertical: 20 }}>Connect Wi-Fi</Text>
      <Text style={{ fontSize: 16, color: theme.text, marginBottom: 20 }}>
        Go to your phone's Wi-Fi settings and connect to the PawFeed network.
      </Text>

      <View style={{ padding: 20, backgroundColor: theme.background, borderRadius: 12, marginBottom: 20 }}>
        <Text style={{ fontWeight: "600", marginBottom: 10 }}>NETWORK: PawFeed</Text>
        <Text style={{ marginBottom: 10 }}>PASSWORD: pawfeed@admin</Text>
        <TouchableOpacity onPress={copyToClipboard}>
          <Text style={{ color: theme.primary }}>Copy Password</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={{ padding: 16, borderRadius: 16, backgroundColor: theme.primary, alignItems: "center" }}
        onPress={() => router.push("/_setup/OpenConfigPage")}
      >
        <Text style={{ color: "#FFF", fontWeight: "700" }}>I'm Connected</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
