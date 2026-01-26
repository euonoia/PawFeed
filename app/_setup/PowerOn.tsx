import React from "react";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/theme/useTheme";

export default function PowerOn() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, padding: 30, backgroundColor: theme.surface }}>
      <Text style={{ fontSize: 14, fontWeight: "700", color: theme.text }}>STEP 1 OF 3</Text>
      <Text style={{ fontSize: 28, fontWeight: "800", color: theme.text, marginVertical: 20 }}>Power On</Text>

      <View style={{ justifyContent: "center", alignItems: "center", marginVertical: 30 }}>
        <Text style={{ fontSize: 50 }}>⚡</Text>
        <Text style={{ fontSize: 16, textAlign: "center", marginTop: 10, color: theme.text }}>
          Plug in your PawFeed device. Look for a red light.
        </Text>
        <Text style={{ fontSize: 16, textAlign: "center", marginTop: 10, color: theme.text }}>
          Broadcasting: PawFeed_XXXX
        </Text>
      </View>

      <TouchableOpacity
        style={{ padding: 16, borderRadius: 16, backgroundColor: theme.primary, alignItems: "center" }}
        onPress={() => router.push("/_setup/ConnectDevice")}
      >
        <Text style={{ color: "#FFF", fontWeight: "700" }}>I've Plugged It In</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
