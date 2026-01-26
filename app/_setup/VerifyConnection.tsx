import React from "react";
import { View, Text, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useClaimDevice } from "@/hooks/useClaimDevice";
import { useTheme } from "@/theme/useTheme";

export default function VerifyConnection() {
  const router = useRouter();
  const theme = useTheme();
  const { claimDevice, loading, error } = useClaimDevice();

  const deviceId = "feeder_001";

  const handleFinishSetup = async () => {
    const success = await claimDevice(deviceId);
    if (success) {
      Alert.alert("Success", "Device claimed successfully!");
      router.replace("/main/home");
    } else {
      Alert.alert("Already Claimed", "This device is already owned.");
      router.replace("/main/home");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 30, backgroundColor: theme.surface }}>
      <View style={{ alignItems: "center", marginVertical: 40 }}>
        <Text style={{ fontSize: 50 }}>✅</Text>
        <Text style={{ fontSize: 24, fontWeight: "700", marginTop: 20 }}>Connection Verified</Text>
        <Text style={{ textAlign: "center", marginTop: 10, color: theme.text }}>
          Your PawFeed device is online and ready.
        </Text>
      </View>

      <TouchableOpacity
        style={{ padding: 16, borderRadius: 16, backgroundColor: "green", alignItems: "center", marginBottom: 12 }}
        onPress={handleFinishSetup}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={{ color: "#FFF", fontWeight: "700" }}>Finish Setup</Text>}
      </TouchableOpacity>

      {error && <Text style={{ color: "red", textAlign: "center", marginTop: 10 }}>{error}</Text>}
    </SafeAreaView>
  );
}
