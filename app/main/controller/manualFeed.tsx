import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, ScrollView, ActivityIndicator } from "react-native";
import { useTheme } from "../../../theme/useTheme";
import { DEVICE_CONFIG } from "../../../config/deviceConfig";
import { rtdb } from "@/config/firebase";
import { ref, set } from "firebase/database";
import { Ionicons } from "@expo/vector-icons";
import FeedButton from "../../../components/FeedButton";
import { useRouter } from "expo-router";
import { useSession } from "@/hooks/useSession";

export default function ManualFeed() {
  const theme = useTheme();
  const router = useRouter();
  const { user, status } = useSession();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect based on session status
    if (status === "unauthenticated") {
      router.replace("/_auth/register");
    } else if (status === "needs-setup") {
      router.replace("/_setup/PowerOn");
    }
  }, [status]);

  const handleFeed = async (angle: number) => {
    if (status !== "ready") return; 

    setLoading(true);
    try {
      const targetRef = ref(
        rtdb,
        DEVICE_CONFIG.PATHS.SERVO_TARGET(DEVICE_CONFIG.ID)
      );
      await set(targetRef, angle);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to dispense food.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };


  if (status === "loading") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.surface }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={[styles.stepText, { color: theme.primary }]}>ACTION CENTER</Text>
          <Text style={[styles.description, { color: theme.muted }]}>
            Select a portion size below to dispense food to your pet immediately.
          </Text>
        </View>

        {/* Portion Selection Card */}
        <View style={[styles.card, { backgroundColor: theme.background }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconCircle, { backgroundColor: theme.primary + '15' }]}>
              <Ionicons name="fast-food-outline" size={18} color={theme.primary} />
            </View>
            <Text style={[styles.label, { color: theme.muted }]}>SELECT PORTION</Text>
          </View>

          <View style={styles.controlsContainer}>
            <FeedButton
              title="Small Portion"
              onPress={() => handleFeed(DEVICE_CONFIG.PORTIONS.SMALL)}
              isLoading={loading}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 40 },
  header: { marginBottom: 24 },
  stepText: { fontSize: 12, fontWeight: "800", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 },
  description: { fontSize: 15, lineHeight: 22 },
  card: { borderRadius: 24, padding: 24, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 20 },
  iconCircle: { width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center" },
  label: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  controlsContainer: { width: "100%", gap: 12 },
  divider: { height: 1, marginVertical: 10 },
  infoBox: { flexDirection: "row", alignItems: "center", marginTop: 30, paddingHorizontal: 8, gap: 12 },
  infoText: { flex: 1, fontSize: 14, lineHeight: 20 },
});
