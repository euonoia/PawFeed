import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/theme/useTheme";
import { useDeviceStatus } from "@/hooks/useDeviceStatus";
import WeightDisplay from "@/components/weight/WeightDisplay";
import ConnectionBadge from "@/components/connections/ConnnectionBadge";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* HEADER SECTION */}
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.stepText, { color: theme.primary }]}>OVERVIEW</Text>
            <Text style={[styles.title, { color: theme.text }]}>PawFeed</Text>
          </View>
          
          <TouchableOpacity 
            onPress={handleLogout}
            style={[styles.iconButton, { backgroundColor: theme.background }]}
          >
            <Ionicons name="log-out-outline" size={22} color={theme.muted} />
          </TouchableOpacity>
        </View>

        {/* CONNECTION STATUS */}
        <View style={styles.statusSection}>
           <ConnectionBadge
            online={isOnline}
            lastSeen={status?.lastSeen}
          />
        </View>

        {/* WEIGHT CARD - Using the same card styling as the setup page */}
        <View style={[styles.card, { backgroundColor: theme.background }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconCircle, { backgroundColor: theme.primary + '15' }]}>
              <Ionicons name="scale-outline" size={20} color={theme.primary} />
            </View>
            <Text style={[styles.label, { color: theme.muted }]}>FOOD WEIGHT</Text>
          </View>
          
          <View style={styles.weightContainer}>
            <WeightDisplay />
          </View>
          
          <View style={[styles.divider, { backgroundColor: theme.muted + '20' }]} />
          
          <TouchableOpacity style={styles.cardAction}>
             <Text style={[styles.actionText, { color: theme.primary }]}>View History</Text>
             <Ionicons name="chevron-forward" size={16} color={theme.primary} />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
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
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  statusSection: {
    marginBottom: 24,
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
    gap: 10,
    marginBottom: 16,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  weightContainer: {
    paddingVertical: 10,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  cardAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "700",
  },
});