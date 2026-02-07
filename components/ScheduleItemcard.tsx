import {
  View,
  Text,
  StyleSheet,
  Switch,
  Pressable,
  Alert,
  TextInput,
  Platform
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState, useRef } from "react";
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
  
  // Local states
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

  const handleUpdate = (updates: Partial<{ time: string; angle: number; active: boolean; grams: number }>) => {
    const finalData = {
      time: updates.time ?? currentTime,
      angle: updates.angle ?? currentAngle,
      active: updates.active ?? enabled,
      grams: updates.grams ?? currentGrams
    };

    
    if (finalData.grams > 500) {
      Alert.alert("Safety Limit", "Maximum portion per feed is 500g.");
      return;
    }

    onSave(finalData);
  };

  const handleToggle = async (value: boolean) => {
    if (value) {
      const allowed = await canDispenseFood();
      if (!allowed) {
        Alert.alert("Feeding Blocked", "Infrared sensor detects food already in bowl.");
        return;
      }
    }
    setEnabled(value);
    handleUpdate({ active: value });
  };

  const handleTimeChange = (_: any, date?: Date) => {
    setPickerOpen(false);
    if (!date) return;
    
    const hh = date.getHours().toString().padStart(2, "0");
    const mm = date.getMinutes().toString().padStart(2, "0");
    const formatted = `${hh}:${mm}`;
    
    setCurrentTime(formatted);
    handleUpdate({ time: formatted });
  };

  const handleCustomGrams = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    const val = numericValue === "" ? 0 : Math.min(parseInt(numericValue, 10), 500);
    setCurrentGrams(val);
  };

  const submitGrams = () => {
    handleUpdate({ grams: currentGrams });
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
          <Text style={[styles.label, { color: theme.muted }]}>{id ? id.toUpperCase() : "FEEDING PLAN"}</Text>
          <Pressable onPress={() => setPickerOpen(true)} style={styles.timePressable}>
            <Text style={[styles.timeValue, { color: theme.text }]}>{currentTime}</Text>
            <Ionicons name="time-outline" size={18} color={theme.primary} style={{ marginLeft: 8 }} />
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

      {/* GRAMS CONFIGURATION */}
      <View style={{ marginBottom: 20 }}>
        <Text style={[styles.label, { color: theme.muted, marginBottom: 8 }]}>TARGET WEIGHT (0-500g)</Text>
        <TextInput
          style={[styles.gramsInput, { color: theme.text, backgroundColor: theme.surface }]}
          keyboardType="numeric"
          value={String(currentGrams)}
          onChangeText={handleCustomGrams}
          onBlur={submitGrams}
          placeholder="0"
          placeholderTextColor={theme.muted}
        />
      </View>

      {/* HARDWARE FLOW RATE (ANGLE) */}
      <View>
        <Text style={[styles.label, { color: theme.muted, marginBottom: 12 }]}>DISPENSER OPENING (FLOW RATE)</Text>
        <View style={styles.portionRow}>
          {[
            { label: "Slow", val: 45 },
            { label: "Fast", val: 90 },
            { label: "Full", val: 180 }
          ].map((item) => (
            <Pressable
              key={item.label}
              onPress={() => {
                setCurrentAngle(item.val);
                handleUpdate({ angle: item.val });
              }}
              style={[
                styles.portionBtn,
                { backgroundColor: theme.surface },
                currentAngle === item.val && { borderColor: theme.primary, borderWidth: 2 }
              ]}
            >
              <Text style={[styles.portionBtnText, { color: currentAngle === item.val ? theme.primary : theme.muted }]}>
                {item.label}
              </Text>
              <Text style={{ fontSize: 9, color: theme.muted }}>{item.val}°</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {pickerOpen && (
        <DateTimePicker 
          mode="time" 
          value={getPickerDate()} 
          is24Hour={true} 
          display={Platform.OS === 'android' ? 'clock' : 'inline'} 
          onChange={handleTimeChange} 
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 28, padding: 24, marginBottom: 16, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
  cardRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  label: { fontSize: 10, fontWeight: "800", letterSpacing: 1, marginBottom: 4 },
  timePressable: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  timeValue: { fontSize: 28, fontWeight: "900" },
  divider: { height: 1, marginVertical: 20 },
  gramsInput: { padding: 14, borderRadius: 16, fontSize: 18, fontWeight: "700", textAlign: 'center' },
  portionRow: { flexDirection: "row", gap: 10 },
  portionBtn: { flex: 1, paddingVertical: 14, borderRadius: 16, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: 'transparent' },
  portionBtnText: { fontSize: 14, fontWeight: "800" },
});