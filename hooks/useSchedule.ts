import { useState, useEffect, useRef } from "react";
import { getDatabase, ref, onValue, set, update } from "firebase/database";
import { firebaseApp } from "../config/firebase";
import { DEVICE_CONFIG } from "../config/deviceConfig";

const db = getDatabase(firebaseApp);
const BASE = `/devices/${DEVICE_CONFIG.ID}/schedule`;
const SERVO_PATH = `/devices/${DEVICE_CONFIG.ID}/servo/targetAngle`;

export type ScheduleItem = {
  time: string;
  angle: number;
  active: boolean;
  grams: number;
  lastRun?: string;
};

export function useSchedule() {
  const [enabled, setEnabled] = useState(false);
  const [items, setItems] = useState<Record<string, ScheduleItem>>({});
  const feedingLock = useRef(false);

  /* ===============================
     REALTIME LISTENER
  =============================== */
  useEffect(() => {
    const unsub = onValue(ref(db, BASE), snap => {
      if (!snap.exists()) return;

      const data = snap.val();
      setEnabled(!!data.enabled);
      setItems(data.items ?? {});
    });

    return () => unsub();
  }, []);

  /* ===============================
     SCHEDULE EXECUTION
  =============================== */
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(async () => {
      if (feedingLock.current) return;

      const now = new Date();
      const currentTime =
        `${now.getHours()}`.padStart(2, "0") +
        ":" +
        `${now.getMinutes()}`.padStart(2, "0");

      const nowSec = Math.floor(Date.now() / 1000);

      for (const [id, item] of Object.entries(items)) {
        if (!item.active) continue;
        if (item.time !== currentTime) continue;

        const lastRun = item.lastRun ? parseInt(item.lastRun, 10) : 0;

        // Prevent multiple runs in the same minute
        if (nowSec - lastRun < 60) continue;

        feedingLock.current = true;

        try {
          // 1️⃣ Move servo to feeding angle
          await set(ref(db, SERVO_PATH), item.angle);

          // 2️⃣ Wait for dispense duration
          await new Promise(resolve => setTimeout(resolve, 1500));

          // 3️⃣ Return servo to 0°
          await set(ref(db, SERVO_PATH), DEVICE_CONFIG.PORTIONS.SMALL);

          // 4️⃣ Save lastRun
          await set(
            ref(db, `${BASE}/items/${id}/lastRun`),
            nowSec.toString()
          );
        } catch (err) {
          console.error("Schedule execution failed:", err);
        } finally {
          feedingLock.current = false;
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [items, enabled]);

  /* ===============================
     API
  =============================== */
  const toggleSchedule = async (value: boolean) => {
    await update(ref(db, BASE), { enabled: value });
    setEnabled(value);
  };

  const saveItem = async (id: string, item: ScheduleItem) => {
    await set(ref(db, `${BASE}/items/${id}`), item);
    setItems(prev => ({ ...prev, [id]: item }));
  };

  return {
    enabled,
    items,
    toggleSchedule,
    saveItem,
  };
}
