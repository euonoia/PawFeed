import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";

export default function PowerOn() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, padding: 30, justifyContent: "center" }}>
      <Text style={{ fontWeight: "bold", fontSize: 18 }}>Step 1 of 3</Text>
      <Text style={{ fontSize: 24, marginVertical: 20 }}>Power On</Text>

      <View style={{ alignItems: "center", marginVertical: 20 }}>
        <Text>[Power Icon]</Text>
      </View>

      <Text>
        Plug in your PawFeed device. Look for a red light to confirm it's ready.
      </Text>
      <Text>Broadcasting: PawFeed_XXXX</Text>

      <View style={{ marginTop: 30 }}>
        <TouchableOpacity onPress={() => router.push("/_setup/ConnectDevice")}>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>I've Plugged It In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 10 }}>
          <Text>Go Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
