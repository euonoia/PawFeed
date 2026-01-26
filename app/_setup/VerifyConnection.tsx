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
import { ref, get } from "firebase/database";
import { useTheme } from "@/theme/useTheme";

export default function VerifyConnection() {
  const router = useRouter();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  const deviceId = "feeder_001";

  const handleFinishSetup = async () => {
    setLoading(true);
    try {
      const snapshot = await get(ref(rtdb, `devices/${deviceId}/owner`));
      if (!snapshot.exists() || snapshot.val() !== auth.currentUser?.uid) {
        Alert.alert("Error", "Device not claimed. Please go back.");
        return;
      }
      Alert.alert("Success", "Device is online and ready!", [
        {
          text: "OK",
          onPress: () => router.replace("/main/home"),
        },
      ]);
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
        <Text style={[styles.title, { color: theme.text }]}>All Set!</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <Text style={{ fontSize: 60 }}>✅</Text>
        </View>
        <Text style={[styles.subtitle, { color: theme.text }]}>Connection Verified</Text>
        <Text style={[styles.description, { color: theme.text }]}>
          Your PawFeed device is now online and ready for testing.
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "green" }]}
          onPress={handleFinishSetup}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Finish Setup</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  header: {
    marginTop: 20,
  },
  stepText: {
    fontSize: 14,
    fontWeight: "600",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 4,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrapper: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  footer: {
    marginBottom: 30,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
