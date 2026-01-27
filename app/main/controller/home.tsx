import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../theme/useTheme";
import { DEVICE_CONFIG } from "../../../config/deviceConfig";
import { rtdb } from "@/config/firebase";
import { ref, set } from "firebase/database";

import FeedButton from "../../../components/FeedButton";

export default function ManualFeed() {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  const handleFeed = async (angle: number) => {
    setLoading(true);
    try {
      const targetRef = ref(
        rtdb,
        DEVICE_CONFIG.PATHS.SERVO_TARGET(DEVICE_CONFIG.ID)
      );

      await set(targetRef, angle);

      Alert.alert("Success", "Food dispensed.");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to dispense food.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Manual Feed
        </Text>

        <Text style={[styles.description, { color: theme.muted }]}>
          Manually dispense food by selecting a portion size.
        </Text>

        <View style={styles.controlsContainer}>
          <FeedButton
            title="Small Portion"
            onPress={() => handleFeed(DEVICE_CONFIG.PORTIONS.SMALL)}
            isLoading={loading}
          />

          <FeedButton
            title="Large Portion"
            onPress={() => handleFeed(DEVICE_CONFIG.PORTIONS.LARGE)}
            isLoading={loading}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  controlsContainer: {
    width: "100%",
    alignItems: "center",
    gap: 16,
  },
});
