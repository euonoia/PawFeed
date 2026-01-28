import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/useTheme";

interface Props {
  online: boolean;
  lastSeen?: number;
}

export default function ConnectionBadge({ online, lastSeen }: Props) {
  const theme = useTheme();

  const statusColor = online ? "#10B981" : "#EF4444"; 
  const statusBg = online ? "#10B98110" : "#EF444410"; 

  return (
    <View style={[styles.container, { backgroundColor: statusBg, borderColor: statusBg }]}>
      <View style={styles.statusRow}>
        <Ionicons 
          name={online ? "cloud-done" : "cloud-offline"} 
          size={16} 
          color={statusColor} 
        />
        <Text style={[styles.statusLabel, { color: statusColor }]}>
          {online ? "ONLINE" : "OFFLINE"}
        </Text>
      </View>

      {!online && typeof lastSeen === "number" && (
        <View style={styles.timeContainer}>
          <Text style={[styles.subText, { color: theme.muted }]}>
            Last sync: {new Date(lastSeen * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: "flex-start", // Align to left to match the card content
    marginBottom: 20,
    width: "100%",
    borderWidth: 1,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  timeContainer: {
    marginTop: 4,
    marginLeft: 24, // Indent to align with the text, not the icon
  },
  subText: {
    fontSize: 12,
    fontWeight: "600",
  },
});