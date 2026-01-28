import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../theme/useTheme";
import { DEVICE_CONFIG } from "../../../config/deviceConfig";
import { rtdb } from "@/config/firebase";
import { ref, set } from "firebase/database";
import { Ionicons } from "@expo/vector-icons";

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
      // Removed Alert to keep it premium, or you could use a toast
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to dispense food.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.surface }]}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Header Section matching Setup UI */}
        <View style={styles.header}>
          <Text style={[styles.stepText, { color: theme.primary }]}>ACTION CENTER</Text>
          <Text style={[styles.title, { color: theme.text }]}>Manual Feed</Text>
          <Text style={[styles.description, { color: theme.muted }]}>
            Select a portion size below to dispense food to your pet immediately.
          </Text>
        </View>

        {/* Portion Selection Card */}
        <View style={[styles.card, { backgroundColor: theme.background }]}>
          <View style={styles.cardHeader}>
             <Ionicons name="fast-food-outline" size={20} color={theme.primary} />
             <Text style={[styles.label, { color: theme.muted }]}>SELECT PORTION</Text>
          </View>

          <View style={styles.controlsContainer}>
            <FeedButton
              title="Small Portion"
              onPress={() => handleFeed(DEVICE_CONFIG.PORTIONS.SMALL)}
              isLoading={loading}
              // Suggestion: Update FeedButton style internally to match theme.primary and borderRadius: 18
            />

            <View style={[styles.divider, { backgroundColor: theme.muted + '15' }]} />

            <FeedButton
              title="Large Portion"
              onPress={() => handleFeed(DEVICE_CONFIG.PORTIONS.LARGE)}
              isLoading={loading}
            />
          </View>
        </View>

        {/* Safety Note */}
        <View style={styles.infoBox}>
          <Ionicons name="alert-circle-outline" size={20} color={theme.muted} />
          <Text style={[styles.infoText, { color: theme.muted }]}>
            Dispensing multiple portions in a short time may cause overfeeding.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  header: {
    marginBottom: 32,
  },
  stepText: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  controlsContainer: {
    width: "100%",
    gap: 12,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    paddingHorizontal: 10,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});