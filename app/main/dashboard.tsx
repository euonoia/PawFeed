import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/theme/useTheme";
import { useDeviceStatus } from "@/hooks/useDeviceStatus";
import WeightDisplay from "@/components/weight/WeightDisplay";
import ConnectionBadge from "@/components/connections/ConnnectionBadge";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useRouter } from "expo-router";

export default function Dashboard() {
  const theme = useTheme();
  const { status, isOnline } = useDeviceStatus();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/_auth/login");
    } catch {
      Alert.alert("Logout Failed", "Please try again.");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: theme.text }]}>
          Pet Feeder Dashboard
        </Text>

        <TouchableOpacity onPress={handleLogout}>
          <Text style={[styles.logoutText, { color: theme.primary }]}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>

      {/* CONNECTION */}
      <ConnectionBadge
        online={isOnline}
        lastSeen={status?.lastSeen}
      />

      {/* WEIGHT */}
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "600",
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
