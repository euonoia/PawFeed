import React from "react";
import { View, Text, StyleSheet, Switch, Alert, ScrollView } from "react-native";
import { useTheme } from "../../../theme/useTheme";
import { useSchedule } from "../../../hooks/useSchedule";
import ScheduleItemCard from "../../../components/ScheduleItemcard";
import { canDispenseFood } from "../../../services/FeedGuardService";
import { Ionicons } from "@expo/vector-icons";

const LOCAL_IP = "http://192.168.4.1";

export default function ScheduleScreen() {
  const theme = useTheme();
  const { enabled, items, toggleSchedule, saveItem } = useSchedule();

  // Helper: Sync everything to Local ESP32 IP
  const syncToLocalDevice = async (updatedItems: any, isEnabled: boolean) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    try {
      // 1. Sync Time (So offline schedules work)
      const epoch = Math.floor(Date.now() / 1000);
      await fetch(`${LOCAL_IP}/api/sync-time?epoch=${epoch}`, { signal: controller.signal });

      // 2. Sync Schedule Data
      await fetch(`${LOCAL_IP}/api/save-schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItems),
        signal: controller.signal,
      });
      
      console.log("Local sync complete.");
    } catch (err) {
      console.log("Local device unreachable, using Cloud only.");
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const handleToggleSchedule = async () => {
    const nextState = !enabled;
    if (nextState) {
      const allowed = await canDispenseFood();
      if (!allowed) {
        Alert.alert("Feeding Blocked", "Cannot enable while food is in the bowl.");
        return;
      }
    }
    
    // Cloud save
    toggleSchedule(nextState);
    // Local sync
    syncToLocalDevice(items, nextState);
  };

  const handleSaveItem = async (id: string, item: any, updated: any) => {
    if (updated.active) {
      const allowed = await canDispenseFood();
      if (!allowed) {
        Alert.alert("Feeding Blocked", "Cannot activate while food is in the bowl.");
        return;
      }
    }

    const fullUpdatedItem = { ...item, ...updated };
    
    // 1. Save to Firebase
    await saveItem(id, fullUpdatedItem);

    // 2. Sync to Local ESP32
    const updatedItemsList = { ...items, [id]: fullUpdatedItem };
    syncToLocalDevice(updatedItemsList, enabled);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.headerSection}>
          <Text style={[styles.stepText, { color: theme.primary }]}>AUTOMATION</Text>
          <Text style={[styles.description, { color: theme.muted }]}>
            Schedules are saved to both the cloud and the device for offline reliability.
          </Text>
        </View>

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
          />
        </View>

        <Text style={[styles.sectionLabel, { color: theme.muted }]}>DAILY ROUTINE</Text>

        <View style={styles.itemsList}>
          {["morning", "evening"].map((id) => {
            const item = items[id] || { time: "07:00", angle: 90, active: false, grams: 0 };
            return (
              <ScheduleItemCard
                key={id}
                id={id}
                time={item.time}
                angle={item.angle}
                active={item.active}
                grams={item.grams || 0}
                onSave={(updated) => handleSaveItem(id, item, updated)}
              />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 40 },
  headerSection: { marginBottom: 24 },
  stepText: { fontSize: 12, fontWeight: "800", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 },
  description: { fontSize: 15, lineHeight: 22 },
  masterCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, borderRadius: 24, marginBottom: 32, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)', elevation: 3 },
  masterInfo: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center" },
  masterLabel: { fontSize: 16, fontWeight: "700" },
  masterSubtext: { fontSize: 13, fontWeight: "600" },
  sectionLabel: { fontSize: 11, fontWeight: "800", letterSpacing: 1.2, marginBottom: 16, marginLeft: 4 },
  itemsList: { gap: 16 },
});