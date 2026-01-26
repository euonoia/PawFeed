import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { rtdb, auth } from "@/config/firebase";
import { ref, get, set } from "firebase/database";
import { useTheme } from "@/theme/useTheme";

export default function SetupDevice() {
  const router = useRouter();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  const deviceId = "feeder_001";

  const handleClaimAndFinish = async () => {
    setLoading(true);
    try {
      if (!auth.currentUser) {
        Alert.alert("Error", "You must be logged in to claim the device.");
        return;
      }

      const ownerRef = ref(rtdb, `devices/${deviceId}/owner`);
      const snapshot = await get(ownerRef);

      if (snapshot.exists()) {
        if (snapshot.val() === auth.currentUser.uid) {
          // Already claimed by this user
          Alert.alert("Info", "Device already claimed by you.");
        } else {
          // Claimed by someone else
          Alert.alert("Error", "Device is already claimed by another user.");
          return;
        }
      } else {
        // Device unclaimed → attempt to claim it
        // This will succeed only if the rules allow it (owner does not exist)
        await set(ownerRef, auth.currentUser.uid);
        Alert.alert("Success", "Device successfully claimed!");
      }

      router.replace("/main/home");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.stepText, { color: theme.primary }]}>FINAL STEP</Text>
        <Text style={[styles.title, { color: theme.text }]}>Setup Device</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.subtitle, { color: theme.text }]}>Claim Your Device</Text>
        <Text style={[styles.description, { color: theme.text }]}>
          Press the button below to claim your PawFeed device and finish setup.
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleClaimAndFinish}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Claim Device</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "space-between" },
  header: { marginTop: 20 },
  stepText: { fontSize: 14, fontWeight: "600" },
  title: { fontSize: 28, fontWeight: "bold", marginTop: 4 },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  subtitle: { fontSize: 22, fontWeight: "600", marginBottom: 8 },
  description: { fontSize: 16, textAlign: "center", paddingHorizontal: 20 },
  footer: { marginBottom: 30 },
  button: { paddingVertical: 14, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
});
