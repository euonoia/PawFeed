import {
  View,
  Text,
  StyleSheet,
  Switch,
  Pressable,
  Alert,
  TextInput
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState, useCallback } from "react";
import { canDispenseFood } from "../services/FeedGuardService";
import { useTheme } from "../theme/useTheme";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  id: string;
  time: string;
  angle: number;
  active: boolean;
  grams: number;
  onSave: (data: {
    time: string;
    angle: number;
    active: boolean;
    grams: number;
  }) => void;
};

export default function ScheduleItemCard({ id, time, angle, active, grams, onSave }: Props) {
  const theme = useTheme();
  
  // Defensive state initialization: if grams is undefined, default to 0
  const [enabled, setEnabled] = useState(active);
  const [currentTime, setCurrentTime] = useState(time || "00:00");
  const [currentAngle, setCurrentAngle] = useState(angle || 90);
  const [currentGrams, setCurrentGrams] = useState(grams ?? 0); 
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    setEnabled(active);
    setCurrentTime(time || "00:00");
    setCurrentAngle(angle || 90);
    setCurrentGrams(grams ?? 0);
  }, [active, time, angle, grams]);

  const save = useCallback((next: { time?: string; angle?: number; active?: boolean; grams?: number }) => {
    onSave({
      time: next.time ?? currentTime,
      angle: next.angle ?? currentAngle,
      active: next.active ?? enabled,
      grams: next.grams ?? currentGrams
    });
  }, [currentTime, currentAngle, enabled, currentGrams, onSave]);

  const handleToggle = async (value: boolean) => {
    if (value) {
      const allowed = await canDispenseFood();
      if (!allowed) {
        Alert.alert("Feeding Blocked", "Cannot activate this schedule while food is still in the bowl.");
        return;
      }
    }
    setEnabled(value);
    save({ active: value });
  };

  const handleTimeChange = (_: any, date?: Date) => {
    setPickerOpen(false);
    if (!date) return;
    const hh = date.getHours().toString().padStart(2, "0");
    const mm = date.getMinutes().toString().padStart(2, "0");
    const formatted = `${hh}:${mm}`;
    setCurrentTime(formatted);
    save({ time: formatted });
  };

  const handleCustomGrams = (text: string) => {
    // Strips non-numeric and handles empty strings
    const numericValue = text.replace(/[^0-9]/g, "");
    const val = numericValue === "" ? 0 : parseInt(numericValue, 10);
    const safeVal = val > 500 ? 500 : val;
    setCurrentGrams(safeVal);
    save({ grams: safeVal });
  };

  const getPickerDate = () => {
    const [h, m] = (currentTime || "00:00").split(':').map(Number);
    const d = new Date();
    d.setHours(h || 0, m || 0, 0, 0);
    return d;
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.background }]}>
      {/* HEADER SECTION */}
      <View style={styles.cardRow}>
        <View>
          <Text style={[styles.label, { color: theme.muted }]}>{id ? id.toUpperCase() : "SCHEDULE"}</Text>
          <Pressable onPress={() => setPickerOpen(true)} style={styles.timePressable}>
            <Text style={[styles.timeValue, { color: theme.text }]}>{currentTime}</Text>
            <Ionicons name="pencil-sharp" size={14} color={theme.primary} style={{ marginLeft: 6 }} />
          </Pressable>
        </View>

        <Switch
          value={enabled}
          onValueChange={handleToggle}
          trackColor={{ false: theme.muted + '40', true: theme.primary }}
          thumbColor="#FFF"
        />
      </View>

      <View style={[styles.divider, { backgroundColor: theme.muted + '15' }]} />

      {/* GRAMS SECTION */}
      <View style={{ marginBottom: 20 }}>
        <Text style={[styles.label, { color: theme.muted, marginBottom: 12 }]}>DESIRED WEIGHT (GRAMS)</Text>
        
        <View style={[styles.inputContainer, { backgroundColor: theme.surface }]}>
          <TextInput
            style={[styles.gramsInput, { color: theme.text }]}
            placeholder="0"
            placeholderTextColor={theme.muted}
            keyboardType="numeric"
            // FIX: This ensures .toString() is never called on an undefined value
            value={currentGrams ? String(currentGrams) : ""}
            onChangeText={handleCustomGrams}
          />
          <Text style={{ color: theme.muted, fontWeight: '700', marginRight: 15 }}>g</Text>
        </View>

        <View style={styles.portionRow}>
          {[10, 20, 50].map((g) => (
            <Pressable
              key={g}
              onPress={() => { setCurrentGrams(g); save({ grams: g }); }}
              style={[
                styles.portionBtn,
                { backgroundColor: theme.surface },
                currentGrams === g && { borderColor: theme.primary, borderWidth: 1.5 }
              ]}
            >
              <Text style={[styles.portionBtnText, { color: currentGrams === g ? theme.primary : theme.muted }]}>{g}g</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* FLOW RATE SECTION */}
      <View>
        <Text style={[styles.label, { color: theme.muted, marginBottom: 12 }]}>DISPENSE ANGLE (FLOW RATE)</Text>
        <View style={styles.portionRow}>
          {[{ label: "Slow", val: 45 }, { label: "Fast", val: 90 }, { label: "Full", val: 180 }].map((portion) => (
            <Pressable
              key={portion.label}
              onPress={() => { setCurrentAngle(portion.val); save({ angle: portion.val }); }}
              style={[
                styles.portionBtn,
                { backgroundColor: theme.surface },
                currentAngle === portion.val && { borderColor: theme.primary, borderWidth: 1.5 }
              ]}
            >
              <Text style={[styles.portionBtnText, { color: currentAngle === portion.val ? theme.primary : theme.muted }]}>{portion.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {pickerOpen && (
        <DateTimePicker 
          mode="time" 
          value={getPickerDate()} 
          is24Hour={true} 
          display="default" 
          onChange={handleTimeChange} 
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 24, padding: 24, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)', elevation: 3, marginBottom: 16 },
  cardRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  label: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginBottom: 4 },
  timePressable: { flexDirection: 'row', alignItems: 'center' },
  timeValue: { fontSize: 24, fontWeight: "900" },
  divider: { height: 1, marginVertical: 20 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  gramsInput: { flex: 1, paddingVertical: 12, paddingHorizontal: 16, fontSize: 16, fontWeight: "600" },
  portionRow: { flexDirection: "row", gap: 12 },
  portionBtn: { flex: 1, paddingVertical: 12, borderRadius: 14, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  portionBtnText: { fontSize: 14, fontWeight: "700" },
});