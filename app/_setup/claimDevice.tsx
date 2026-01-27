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
import { Ionicons } from "@expo/vector-icons";

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
          Alert.alert("Info", "Device already claimed by you.");
        } else {
          Alert.alert("Error", "Device is already claimed by another user.");
          return;
        }
      } else {
        await set(ownerRef, auth.currentUser.uid);
        Alert.alert("Success", "Device successfully claimed!");
      }

      router.replace("/main/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
      {/* Final Progress State */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { backgroundColor: theme.primary, width: "100%" }]} />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.stepText, { color: theme.primary }]}>FINAL STEP</Text>
          <Text style={[styles.title, { color: theme.text }]}>Setup Device</Text>
        </View>

        <View style={styles.mainIllustration}>
          <View style={[styles.iconCircle, { backgroundColor: theme.primary + '10' }]}>
            <Ionicons name="link" size={50} color={theme.primary} />
          </View>
          <Text style={[styles.subtitle, { color: theme.text }]}>Claim Your Device</Text>
          <Text style={[styles.description, { color: theme.muted }]}>
            We're ready to link <Text style={styles.boldText}>PawFeed</Text> to your account. 
            This ensures only you can manage your pet's schedule.
          </Text>
        </View>

        {/* Device ID Card */}
        <View style={[styles.idCard, { backgroundColor: theme.background }]}>
          <View>
            <Text style={[styles.label, { color: theme.muted }]}>IDENTIFIED DEVICE</Text>
            <Text style={[styles.deviceIdText, { color: theme.text }]}>{deviceId}</Text>
          </View>
          <Ionicons name="hardware-chip-outline" size={24} color={theme.primary} />
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.primaryButton, { backgroundColor: theme.primary, opacity: loading ? 0.7 : 1 }]}
          onPress={handleClaimAndFinish}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <View style={styles.buttonRow}>
              <Text style={styles.buttonText}>Claim & Finish Setup</Text>
              <Ionicons name="checkmark-circle" size={20} color="#FFF" />
            </View>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => router.back()} disabled={loading} style={styles.backButton}>
          <Text style={[styles.backText, { color: theme.muted }]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  progressTrack: { height: 6, width: "100%", backgroundColor: "#F0F0F0" },
  progressFill: { height: "100%", borderTopRightRadius: 10, borderBottomRightRadius: 10 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 40 },
  header: { marginBottom: 32 },
  stepText: { fontSize: 12, fontWeight: "800", letterSpacing: 1.5, textTransform: "uppercase" },
  title: { fontSize: 32, fontWeight: "900", marginTop: 4 },
  mainIllustration: { alignItems: "center", marginBottom: 40 },
  iconCircle: { width: 100, height: 100, borderRadius: 50, justifyContent: "center", alignItems: "center", marginBottom: 20 },
  subtitle: { fontSize: 22, fontWeight: "800", marginBottom: 12 },
  description: { fontSize: 16, textAlign: "center", lineHeight: 24, paddingHorizontal: 15 },
  boldText: { fontWeight: "800", color: "#000" },
  idCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, borderRadius: 20, borderWidth: 1, borderColor: "rgba(0,0,0,0.05)" },
  label: { fontSize: 10, fontWeight: "800", letterSpacing: 1, marginBottom: 4 },
  deviceIdText: { fontSize: 18, fontWeight: "700" },
  footer: { padding: 24, gap: 12 },
  primaryButton: { paddingVertical: 18, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  buttonRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  buttonText: { color: "#FFF", fontSize: 18, fontWeight: "700" },
  backButton: { paddingVertical: 12 },
  backText: { textAlign: "center", fontSize: 16, fontWeight: "600" },
});