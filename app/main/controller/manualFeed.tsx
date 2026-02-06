import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, ScrollView } from "react-native";
import { useTheme } from "../../../theme/useTheme";
import { DEVICE_CONFIG } from "../../../config/deviceConfig";
import { rtdb } from "@/config/firebase";
import { ref, set } from "firebase/database";
import { Ionicons } from "@expo/vector-icons";
import FeedButton from "../../../components/FeedButton";

const LOCAL_IP = "http://192.168.4.1";

export default function ManualFeed() {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  const handleFeed = async (angle: number, grams: number = 0) => {
    setLoading(true);
    
    // 1. TRY LOCAL IP FIRST (Fastest)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500); 

    try {
      // Local API expects /api/feed?grams=X&angle=Y
      const response = await fetch(`${LOCAL_IP}/api/feed?grams=${grams}&angle=${angle}`, {
        signal: controller.signal
      });
      
      if (response.ok) {
        setLoading(false);
        return; // Success locally
      }
    } catch (err) {
      console.log("Local unreachable, trying Cloud...");
    } finally {
      clearTimeout(timeoutId);
    }

    // 2. FALLBACK TO FIREBASE (Remote)
    try {
      const targetRef = ref(rtdb, DEVICE_CONFIG.PATHS.SERVO_TARGET(DEVICE_CONFIG.ID));
      await set(targetRef, angle);
    } catch (err: unknown) {
      Alert.alert("Error", "Could not connect to feeder.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.header}>
          <Text style={[styles.stepText, { color: theme.primary }]}>MANUAL CONTROL</Text>
          <Text style={[styles.description, { color: theme.muted }]}>
            Directly control the feeder gate. Local connection is prioritized for instant response.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.background }]}>
          <View style={styles.cardHeader}>
             <View style={[styles.iconCircle, { backgroundColor: theme.primary + '15' }]}>
                <Ionicons name="options-outline" size={18} color={theme.primary} />
             </View>
             <Text style={[styles.label, { color: theme.muted }]}>GATE POSITION</Text>
          </View>

          <View style={styles.controlsContainer}>
            {/* CLOSE POSITION */}
            <FeedButton
              title="Close Gate (0°)"
              onPress={() => handleFeed(0, 0)}
              isLoading={loading}
            />
            
            <View style={[styles.divider, { backgroundColor: theme.muted + '15' }]} />

            {/* HALF POSITION */}
            <FeedButton
              title="Half Open (90°)"
              onPress={() => handleFeed(90, 50)} // Default 50g for manual triggers
              isLoading={loading}
            />

            <View style={[styles.divider, { backgroundColor: theme.muted + '15' }]} />

            {/* FULL POSITION */}
            <FeedButton
              title="Full Open (180°)"
              onPress={() => handleFeed(180, 100)} // Default 100g for full open
              isLoading={loading}
            />
          </View>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="shield-checkmark-outline" size={20} color={theme.primary} />
          <Text style={[styles.infoText, { color: theme.muted }]}>
            Hybrid mode active: Device will tare and weigh before dispensing.
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
  card: { borderRadius: 24, padding: 24, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)', elevation: 3 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 20 },
  iconCircle: { width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center" },
  label: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  controlsContainer: { width: "100%", gap: 12 },
  divider: { height: 1, marginVertical: 10 },
  infoBox: { flexDirection: "row", alignItems: "center", marginTop: 30, paddingHorizontal: 8, gap: 12 },
  infoText: { flex: 1, fontSize: 14, lineHeight: 20 },
});