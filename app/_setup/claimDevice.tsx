import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, rtdb, db } from "@/config/firebase";
import { ref, get, set } from "firebase/database";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useTheme } from "@/theme/useTheme";
import { useRouter } from "expo-router";

export default function SetupDevice() {
  const theme = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const deviceId = "feeder_001";

  // ✅ Auto-redirect if setup already completed
  useEffect(() => {
    const checkSetupStatus = async () => {
      if (!auth.currentUser) return;
      try {
        const setupSnap = await getDoc(
          doc(db, "users", auth.currentUser.uid, "setup", "status")
        );
        if (setupSnap.exists() && setupSnap.data()?.completed) {
          router.replace("/main/dashboard");
        }
      } catch (err) {
        console.log("Error checking setup status:", err);
      } finally {
        setChecking(false);
      }
    };

    checkSetupStatus();
  }, []);

  const handleClaimDevice = async () => {
    if (!auth.currentUser) {
      Alert.alert("Error", "You must be logged in to claim the device.");
      return;
    }

    setLoading(true);

    try {
    
      const ownerRef = ref(rtdb, `devices/${deviceId}/owner`);
      const snapshot = await get(ownerRef);

      if (snapshot.exists() && snapshot.val() !== auth.currentUser.uid) {
        Alert.alert("Error", "Device already claimed by another user.");
        setLoading(false);
        return;
      }

     
      await set(ownerRef, auth.currentUser.uid);

      
      await setDoc(
        doc(db, "users", auth.currentUser.uid, "setup", "status"),
        { completed: true },
        { merge: true }
      );

      Alert.alert("Success", "Device claimed! Setup completed.");

      
      router.replace("/main/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.surface,
        }}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>Claim Your Device</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>
          Only you can manage your PawFeed device.
        </Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary, opacity: loading ? 0.7 : 1 }]}
          onPress={handleClaimDevice}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Claim & Finish Setup</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { width: "80%", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "800", marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: "center", marginBottom: 20 },
  button: { padding: 16, borderRadius: 16, alignItems: "center", width: "100%" },
  buttonText: { color: "#FFF", fontWeight: "700", fontSize: 16 },
});
