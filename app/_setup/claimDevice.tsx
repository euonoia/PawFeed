import React, { useState, useEffect } from "react";
import { 
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, 
  ActivityIndicator, Alert 
} from "react-native";
import { useRouter } from "expo-router";
import { rtdb, auth } from "@/config/firebase";
import { ref, get, update } from "firebase/database";
import { useTheme } from "@/theme/useTheme";
import { Ionicons } from "@expo/vector-icons";

export default function ClaimDevice() {
  const router = useRouter();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const deviceId = "feeder_001"; // ✅ rely only on this path

  const [deviceOwner, setDeviceOwner] = useState<string | null>(null);

  // 🔹 Check owner in Realtime Database
  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const snapshot = await get(ref(rtdb, `devices/${deviceId}/owner`));
        setDeviceOwner(snapshot.exists() ? snapshot.val() : null);
      } catch (error: any) {
        console.log("Failed to fetch device owner:", error.message);
      }
    };

    fetchOwner();
  }, []);

  // 🔹 Claim device
  const handleClaim = async () => {
    if (deviceOwner) {
      Alert.alert("Already Claimed", "This device has already been claimed.");
      return;
    }

    setLoading(true);
    try {
      await update(ref(rtdb, `devices/${deviceId}`), {
        owner: auth.currentUser?.uid,
      });

      Alert.alert("Success", "Device claimed successfully!");
      router.replace("/_setup/VerifyConnection");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
      
      {/* Progress Bar (100%) */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: theme.primary, width: "100%" }]} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.stepText, { color: theme.primary }]}>STEP 3 OF 3</Text>
        <Text style={[styles.title, { color: theme.text }]}>Claim Device</Text>

        <Text style={[styles.description, { color: theme.muted }]}>
          Finalize the setup by linking this device to your account.
        </Text>

        {/* Device ID Card */}
        <View style={[styles.card, { backgroundColor: theme.background }]}>
          <View style={styles.row}>
            <View>
              <Text style={[styles.label, { color: theme.muted }]}>DEVICE ID</Text>
              <Text style={[styles.value, { color: theme.text }]}>{deviceId}</Text>
            </View>
            <Ionicons name="hardware-chip-outline" size={24} color={theme.primary} />
          </View>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="shield-checkmark-outline" size={20} color={theme.muted} />
          <Text style={[styles.infoText, { color: theme.muted }]}>
            Claiming ensures only you can manage your pet's feeding schedule.
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: theme.primary, opacity: loading ? 0.7 : 1 }
          ]}
          onPress={handleClaim}
          disabled={loading || !!deviceOwner}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Finish Setup</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} disabled={loading}>
          <Text style={[styles.backText, { color: theme.muted }]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ✅ Styles remain unchanged
const styles = StyleSheet.create({
  container: { flex: 1 },
  progressContainer: { height: 4, width: "100%", backgroundColor: "#E0E0E0", marginTop: 10 },
  progressBar: { height: "100%" },
  content: { flex: 1, paddingHorizontal: 30, paddingTop: 40 },
  stepText: { fontSize: 14, fontWeight: "700", letterSpacing: 1, marginBottom: 8 },
  title: { fontSize: 32, fontWeight: "800", marginBottom: 12 },
  description: { fontSize: 16, lineHeight: 24, marginBottom: 32 },
  card: {
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 30,
  },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  label: { fontSize: 12, fontWeight: "700", letterSpacing: 0.5, marginBottom: 4 },
  value: { fontSize: 18, fontWeight: "600" },
  infoBox: { flexDirection: "row", gap: 10, paddingHorizontal: 10 },
  infoText: { fontSize: 14, flex: 1, lineHeight: 20 },
  footer: { padding: 30, gap: 15 },
  button: { paddingVertical: 18, borderRadius: 16, alignItems: "center", justifyContent: "center", minHeight: 60 },
  buttonText: { color: "#FFF", fontSize: 18, fontWeight: "700" },
  backText: { textAlign: "center", fontSize: 16, fontWeight: "600" },
});
