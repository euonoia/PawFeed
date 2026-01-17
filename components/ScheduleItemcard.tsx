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

export default function ScheduleItemCard({
  id,
  time,
  angle,
  active,
  onSave
}: Props) {
  
  const [enabled, setEnabled] = useState(active);
  const [currentTime, setCurrentTime] = useState(time);
  const [currentAngle, setCurrentAngle] = useState(angle);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    setEnabled(active);
    setCurrentTime(time);
    setCurrentAngle(angle);
  }, [active, time, angle]);

  const save = (next: {
    time?: string;
    angle?: number;
    active?: boolean;
  }) => {
    onSave({
      time: next.time ?? currentTime,
      angle: next.angle ?? currentAngle,
      active: next.active ?? enabled
    });
  };

  /**
   * Guarded toggle
   */
  const handleToggle = async (value: boolean) => {
    if (value) {
      const allowed = await canDispenseFood();

      if (!allowed) {
        Alert.alert(
          "Feeding Blocked",
          "Cannot activate this schedule while food is still in the bowl."
        );
        return;
      }
    }

    setEnabled(value);
    save({ active: value });
  };

  const handleTimeChange = async (_: any, date?: Date) => {
    setPickerOpen(false);
    if (!date) return;

    if (enabled) {
      const allowed = await canDispenseFood();
      if (!allowed) {
        Alert.alert(
          "Update Blocked",
          "Disable the schedule before changing the time."
        );
        return;
      }
    }

    const hh = date
      .getHours()
      .toString()
      .padStart(2, "0");
    const mm = date
      .getMinutes()
      .toString()
      .padStart(2, "0");

    const formatted = `${hh}:${mm}`;

    setCurrentTime(formatted);
    save({ time: formatted });
  };

  const handlePortion = async (value: number) => {
    if (enabled) {
      const allowed = await canDispenseFood();

      if (!allowed) {
        Alert.alert(
          "Update Blocked",
          "Disable the schedule before changing the portion."
        );
        return;
      }
    }

    setCurrentAngle(value);
    save({ angle: value });
  };

  return (
    <View style={styles.card}>
      {/* HEADER */}
      <View style={styles.row}>
        <Text style={styles.title}>
          {id.toUpperCase()}
        </Text>

        <Switch
          value={enabled}
          onValueChange={handleToggle}
        />
      </View>

      {/* TIME */}
      <Pressable onPress={() => setPickerOpen(true)}>
        <Text style={styles.time}>
          Time: {currentTime}
        </Text>
      </Pressable>

      {/* PORTION */}
      <View style={styles.portions}>
        <Pressable onPress={() => handlePortion(45)}>
          <Text style={styles.btn}>Small</Text>
        </Pressable>

        <Pressable onPress={() => handlePortion(90)}>
          <Text style={styles.btn}>Large</Text>
        </Pressable>
      </View>

      {/* TIME PICKER */}
      {pickerOpen && (
        <DateTimePicker
          mode="time"
          value={new Date()}
          is24Hour
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#edf2f7",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },
  title: {
    fontSize: 16,
    fontWeight: "bold"
  },
  time: {
    fontSize: 16,
    marginBottom: 10
  },
  portions: {
    flexDirection: "row",
    gap: 10
  },
  btn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#cbd5e0",
    borderRadius: 8
  }
});
