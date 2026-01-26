import { useEffect, useState } from "react";
import { getDatabase, ref, onValue, set, update, } from "firebase/database";
import { firebaseApp } from "../config/firebase";
import { DEVICE_CONFIG } from "../config/deviceConfig";

const db = getDatabase(firebaseApp);
const BASE = `/devices/${DEVICE_CONFIG.ID}/schedule`;

export type ScheduleItem = {
  time: string;
  angle: number;
  active: boolean;
  lastRun?: string;
};

export function useSchedule() {
  const [enabled, setEnabled] = useState(false);
  const [items, setItems] = useState<Record<string, ScheduleItem>>({});

  useEffect(() => {
    const unsub = onValue(ref(db, BASE), snap => {
      if (!snap.exists()) return;

      const data = snap.val();
      setEnabled(!!data.enabled);
      setItems(data.items ?? {});
    });

    return () => unsub();
  }, []);

  const toggleSchedule = (value: boolean) =>
    update(ref(db, BASE), { enabled: value });

  const saveItem = async (id: string, item: ScheduleItem) => {
    await set(ref(db, `${BASE}/items/${id}`), item);

    // Immediately update the ESP32 targetAngle if the item is active and it's time
    if (!item.active) return;

    const now = new Date();
    const [hourStr, minuteStr] = item.time.split(":");
    const itemHour = parseInt(hourStr, 10);
    const itemMinute = parseInt(minuteStr, 10);

    if (now.getHours() === itemHour && now.getMinutes() === itemMinute) {
      // Write targetAngle for ESP32 to pick up
      const targetRef = ref(db, `/devices/${DEVICE_CONFIG.ID}/servo/targetAngle`);
      await set(targetRef, item.angle);

      // Update lastRun so ESP32 doesn’t repeat
      const lastRunRef = ref(db, `${BASE}/items/${id}/lastRun`);
      await set(lastRunRef, Math.floor(Date.now() / 1000).toString());
    }
  };

  return { enabled, items, toggleSchedule, saveItem };
}
