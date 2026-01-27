import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/theme/useTheme";
import { useDeviceStatus } from "@/hooks/useDeviceStatus";
import WeightDisplay from "@/components/weight/WeightDisplay";
import ConnectionBadge from "@/components/connections/ConnnectionBadge";

export default function Dashboard() {
  const theme = useTheme();
  const { status, isOnline } = useDeviceStatus();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        Pet Feeder Dashboard
      </Text>

      {/* CONNECTION — SAME COMPONENT */}
      <ConnectionBadge
        online={isOnline}
        lastSeen={status?.lastSeen}
      />

      {/* WEIGHT — SAME COMPONENT */}
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Text style={[styles.label, { color: theme.muted }]}>Food Weight</Text>
        <WeightDisplay />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
  },
  card: {
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
  },
});
