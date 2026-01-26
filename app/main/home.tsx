import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../theme/useTheme";
import { useDeviceStatus } from "../../hooks/useDeviceStatus";
import { feedIfEmpty } from "../../services/esp32Service";
import { DEVICE_CONFIG } from "../../config/deviceConfig";
import { rtdb, auth } from "@/config/firebase";
import { ref, get, set } from "firebase/database";

import ConnectionBadge from "../../components/connections/ConnnectionBadge";
import FeedButton from "../../components/FeedButton";
import WeightDisplay from "../../components/weight/WeightDisplay";

export default function Home() {
  const theme = useTheme();
  const { status, isOnline } = useDeviceStatus();
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  // Check if logged in user is the owner
  useEffect(() => {
    const checkOwnership = async () => {
      if (!auth.currentUser) return;
      try {
        const ownerRef = ref(rtdb, DEVICE_CONFIG.PATHS.OWNER(DEVICE_CONFIG.ID));
        const snapshot = await get(ownerRef);
        setIsOwner(snapshot.exists() && snapshot.val() === auth.currentUser?.uid);
      } catch (err) {
        console.error("Failed to check ownership:", err);
        setIsOwner(false);
      }
    };
    checkOwnership();
  }, []);

  const handleFeed = async (angle: number) => {
    if (!isOnline) {
      Alert.alert("Offline", "Cannot feed while device is offline.");
      return;
    }
    if (!isOwner) {
      Alert.alert("Not Authorized", "You are not the owner of this device.");
      return;
    }

    setLoading(true);
    try {
      // Write targetAngle to the database
      const targetRef = ref(rtdb, DEVICE_CONFIG.PATHS.SERVO_TARGET(DEVICE_CONFIG.ID));
      await set(targetRef, angle);

      Alert.alert("Success", "Yummy! Food dispensed.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to dispense food.";
      Alert.alert("Cannot Feed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Pet Feeder 3000</Text>

        {/* STATUS */}
        <ConnectionBadge online={isOnline} lastSeen={status?.lastSeen} />

        {/* WEIGHT */}
        <WeightDisplay />

        {/* CONTROLS */}
        <View style={styles.controlsContainer}>
          <Text style={[styles.sectionLabel, { color: theme.muted }]}>Select Portion</Text>

          <FeedButton
            title="Small Portion"
            onPress={() => handleFeed(DEVICE_CONFIG.PORTIONS.SMALL)}
            isLoading={loading}
            disabled={!isOnline || !isOwner}
          />

          <FeedButton
            title="Large Portion"
            onPress={() => handleFeed(DEVICE_CONFIG.PORTIONS.LARGE)}
            isLoading={loading}
            disabled={!isOnline || !isOwner}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 20, alignItems: "center" },
  headerTitle: { fontSize: 28, fontWeight: "700", marginBottom: 20, marginTop: 10 },
  controlsContainer: { width: "100%", alignItems: "center", marginTop: 40 },
  sectionLabel: { fontSize: 16, marginBottom: 15, fontWeight: "500" },
});
