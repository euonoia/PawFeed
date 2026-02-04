import {
  View,
  Text,
  StyleSheet,
  Switch,
  Pressable,
  Alert
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import { canDispenseFood } from "../services/FeedGuardService";
import { useTheme } from "../theme/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { dispensePortion } from "../services/ServoHelper"; 

type Props = {
  id: string;
  time: string;
  angle: number;
  active: boolean;
  onSave: (data: {
    time: string;
    angle: number;
    active: boolean;
  }) => void;
};

export default function ScheduleItemCard({ id, time, angle, active, onSave }: Props) {
  const theme = useTheme();
  const [enabled, setEnabled] = useState(active);
  const [currentTime, setCurrentTime] = useState(time);
  const [currentAngle, setCurrentAngle] = useState(angle);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    setEnabled(active);
    setCurrentTime(time);
    setCurrentAngle(angle);
  }, [active, time, angle]);

  const save = (next: { time?: string; angle?: number; active?: boolean }) => {
    onSave({
      time: next.time ?? currentTime,
      angle: next.angle ?? currentAngle,
      active: next.active ?? enabled
    });
  };

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

  const handleTimeChange = async (_: any, date?: Date) => {
    setPickerOpen(false);
    if (!date) return;
    const hh = date.getHours().toString().padStart(2, "0");
    const mm = date.getMinutes().toString().padStart(2, "0");
    const formatted = `${hh}:${mm}`;
    setCurrentTime(formatted);
    save({ time: formatted });
  };

  const handlePortionPress = async (portionAngle: number) => {
    const allowed = await canDispenseFood();
    if (!allowed) {
      Alert.alert("Feeding Blocked", "Cannot dispense while food is still in the bowl.");
      return;
    }

    setCurrentAngle(portionAngle);
    save({ angle: portionAngle });

    // Move servo and automatically return to CLOSE
    await dispensePortion(portionAngle);
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.background }]}>
      {/* HEADER */}
      <View style={styles.cardRow}>
        <View>
          <Text style={[styles.label, { color: theme.muted }]}>{id.toUpperCase()}</Text>
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

      {/* PORTION SELECTOR */}
      <View>
        <Text style={[styles.label, { color: theme.muted, marginBottom: 12 }]}>PORTION SIZE</Text>
        <View style={styles.portionRow}>
          {[
            { label: "Small", val: 45 },
            { label: "Large", val: 90 }
          ].map((portion) => (
            <Pressable
              key={portion.label}
              onPress={() => handlePortionPress(portion.val)}
              style={[
                styles.portionBtn,
                { backgroundColor: theme.surface },
                currentAngle === portion.val && { borderColor: theme.primary, borderWidth: 1.5 }
              ]}
            >
              <Text style={[
                styles.portionBtnText, 
                { color: currentAngle === portion.val ? theme.primary : theme.muted }
              ]}>
                {portion.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {pickerOpen && (
        <DateTimePicker mode="time" value={new Date()} is24Hour display="default" onChange={handleTimeChange} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  timePressable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeValue: {
    fontSize: 24,
    fontWeight: "900",
  },
  divider: {
    height: 1,
    marginVertical: 20,
  },
  portionRow: {
    flexDirection: "row",
    gap: 12,
  },
  portionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  portionBtnText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
