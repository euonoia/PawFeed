import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../../../theme/useTheme";
import { DEVICE_CONFIG } from "../../../config/deviceConfig";
import { rtdb } from "@/config/firebase";
import { ref, set, onValue } from "firebase/database";
import { Ionicons } from "@expo/vector-icons";

const LOCAL_IP = "http://192.168.4.1";

export default function ManualFeed() {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [connectionMode, setConnectionMode] =
    useState<"Checking" | "Local" | "Cloud">("Checking");
  const [currentAngle, setCurrentAngle] = useState(0);

  // Sync applied servo angle
  useEffect(() => {
    const angleRef = ref(
      rtdb,
      `/devices/${DEVICE_CONFIG.ID}/servo/appliedAngle`
    );
    return onValue(angleRef, (snapshot) => {
      if (snapshot.exists()) {
        setCurrentAngle(snapshot.val());
      }
    });
  }, []);

  const handleGate = async (angle: 0 | 90) => {
    setLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    // 1️⃣ Try LOCAL control first
    try {
      const res = await fetch(`${LOCAL_IP}/servo?pos=${angle}`, {
        signal: controller.signal,
      });
      if (res.ok) {
        setConnectionMode("Local");
        setLoading(false);
        return;
      }
    } catch {
      setConnectionMode("Cloud");
    } finally {
      clearTimeout(timeoutId);
    }

    // 2️⃣ Fallback to Firebase
    try {
      const targetRef = ref(
        rtdb,
        `/devices/${DEVICE_CONFIG.ID}/servo/targetAngle`
      );
      await set(targetRef, angle);
    } catch {
      Alert.alert("Offline", "Feeder is unreachable.");
    } finally {
      setLoading(false);
    }
  };

  const GateOption = ({
    title,
    angle,
    icon,
  }: {
    title: string;
    angle: 0 | 90;
    icon: string;
  }) => {
    const isActive = currentAngle === angle;

    return (
      <TouchableOpacity
        style={[
          styles.gateCard,
          {
            backgroundColor: theme.background,
            borderColor: isActive ? theme.primary : "transparent",
          },
        ]}
        onPress={() => handleGate(angle)}
        disabled={loading}
      >
        <View
          style={[
            styles.iconBox,
            { backgroundColor: isActive ? theme.primary : theme.surface },
          ]}
        >
          <Ionicons
            name={icon as any}
            size={24}
            color={isActive ? "#FFF" : theme.primary}
          />
        </View>

        <View style={styles.gateInfo}>
          <Text style={[styles.gateTitle, { color: theme.text }]}>
            {title}
          </Text>
          <Text style={[styles.gateSub, { color: theme.muted }]}>
            {angle === 0 ? "Gate locked" : "Gate open"}
          </Text>
        </View>

        {loading && isActive ? (
          <ActivityIndicator color={theme.primary} />
        ) : (
          <Ionicons name="chevron-forward" size={18} color={theme.muted} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.row}>
            <Text style={[styles.stepText, { color: theme.primary }]}>
              Manual Gate Control
            </Text>

            <View
              style={[
                styles.badge,
                {
                  backgroundColor:
                    connectionMode === "Local"
                      ? "#34C75920"
                      : "#FF950020",
                },
              ]}
            >
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      connectionMode === "Local"
                        ? "#34C759"
                        : "#FF9500",
                  },
                ]}
              />
              <Text
                style={[
                  styles.badgeText,
                  {
                    color:
                      connectionMode === "Local"
                        ? "#34C759"
                        : "#FF9500",
                  },
                ]}
              >
                {connectionMode}
              </Text>
            </View>
          </View>

          <Text style={[styles.description, { color: theme.muted }]}>
            Directly open or close the feeding gate. This action overrides
            scheduled feeds.
          </Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          <GateOption
            title="Close Gate"
            angle={0}
            icon="lock-closed-outline"
          />
          <GateOption
            title="Open Gate"
            angle={90}
            icon="lock-open-outline"
          />
        </View>

        {/* Info */}
        <View style={[styles.warningBox, { backgroundColor: theme.primary + "08" }]}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={theme.primary}
          />
          <Text style={[styles.infoText, { color: theme.muted }]}>
            Manual control lets you control the feeding gate and your desired grams
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24 },
  header: { marginBottom: 32 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  stepText: { fontSize: 13, fontWeight: "800", letterSpacing: 1, textTransform: "uppercase" },
  description: { fontSize: 15, lineHeight: 22 },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  optionsContainer: { gap: 16 },
  gateCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 18, borderWidth: 2, gap: 16 },
  iconBox: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  gateInfo: { flex: 1 },
  gateTitle: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  gateSub: { fontSize: 13 },
  warningBox: { flexDirection: "row", marginTop: 40, padding: 16, borderRadius: 16, gap: 12, alignItems: 'center' },
  infoText: { flex: 1, fontSize: 13, lineHeight: 18 },
});