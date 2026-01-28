import React from "react";
import { View, Text, StyleSheet, Switch, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../theme/useTheme";
import { useSchedule } from "../../../hooks/useSchedule";
import ScheduleItemCard from "../../../components/ScheduleItemcard";
import { canDispenseFood } from "../../../services/FeedGuardService";
import { Ionicons } from "@expo/vector-icons";

export default function ScheduleScreen() {
  const theme = useTheme();
  const { enabled, items, toggleSchedule, saveItem } = useSchedule();

  const handleToggleSchedule = async () => {
    if (!enabled) {
      const allowed = await canDispenseFood();
      if (!allowed) {
        Alert.alert(
          "Feeding Blocked",
          "Cannot enable automatic feeding while food is still in the bowl."
        );
        return;
      }
    }
    toggleSchedule(!enabled);
  };

  const handleSaveItem = async (id: string, item: any, updated: any) => {
    if (updated.active) {
      const allowed = await canDispenseFood();
      if (!allowed) {
        Alert.alert(
          "Feeding Blocked",
          "Cannot activate this schedule while food is still in the bowl."
        );
        return;
      }
    }
    saveItem(id, { ...item, ...updated });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.surface }]}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Consistent Header */}
        <View style={styles.headerSection}>
          <Text style={[styles.stepText, { color: theme.primary }]}>AUTOMATION</Text>
          <Text style={[styles.title, { color: theme.text }]}>Schedule</Text>
          <Text style={[styles.description, { color: theme.muted }]}>
            Set up recurring feeding times for your pet throughout the day.
          </Text>
        </View>

        {/* Master Toggle Card */}
        <View style={[styles.masterCard, { backgroundColor: theme.background }]}>
          <View style={styles.masterInfo}>
            <View style={[styles.iconCircle, { backgroundColor: theme.primary + '15' }]}>
              <Ionicons name="timer-outline" size={20} color={theme.primary} />
            </View>
            <View>
              <Text style={[styles.masterLabel, { color: theme.text }]}>Master Schedule</Text>
              <Text style={[styles.masterSubtext, { color: theme.muted }]}>
                {enabled ? "Active" : "Disabled"}
              </Text>
            </View>
          </View>
          <Switch
            value={enabled}
            onValueChange={handleToggleSchedule}
            trackColor={{ false: theme.muted + '40', true: theme.primary }}
            thumbColor="#FFF"
            ios_backgroundColor={theme.muted + '40'}
          />
        </View>

        <Text style={[styles.sectionLabel, { color: theme.muted }]}>DAILY ROUTINE</Text>

        {/* Schedule Items */}
        <View style={styles.itemsList}>
          {["morning", "evening"].map((id) => {
            const item = items[id] ?? {
              time: "07:00",
              angle: 45,
              active: false,
            };

            return (
              <ScheduleItemCard
                key={id}
                id={id}
                time={item.time}
                angle={item.angle}
                active={item.active}
                onSave={(updated) => handleSaveItem(id, item, updated)}
              />
            );
          })}
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
    paddingBottom: 40,
  },
  headerSection: {
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
  masterCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderRadius: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  masterInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  masterLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
  masterSubtext: {
    fontSize: 13,
    fontWeight: "600",
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 16,
    marginLeft: 4,
  },
  itemsList: {
    gap: 16,
  },
});