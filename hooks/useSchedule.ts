import { useState, useEffect } from "react";
import { getDatabase, ref, onValue, set, update } from "firebase/database";
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

  // Listen to schedule changes in real-time
  useEffect(() => {
    const unsub = onValue(ref(db, BASE), snap => {
      if (!snap.exists()) return;

      const data = snap.val();
      setEnabled(!!data.enabled);
      setItems(data.items ?? {});
    });

    return () => unsub();
  }, []);

  // Function to check and trigger feeds automatically
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(async () => {
      const now = new Date();
      const currentTime = `${now.getHours()}`.padStart(2, "0") + ":" + `${now.getMinutes()}`.padStart(2, "0");

      for (const [id, item] of Object.entries(items)) {
        if (!item.active) continue;
        if (item.time !== currentTime) continue;

        const lastRun = item.lastRun ? parseInt(item.lastRun, 10) : 0;

        // Prevent multiple triggers within the same minute
        if (lastRun >= Math.floor(Date.now() / 1000 / 60) * 60) continue;

        // Trigger the feed by updating targetAngle
        const targetRef = ref(db, `/devices/${DEVICE_CONFIG.ID}/servo/targetAngle`);
        await set(targetRef, item.angle);

        // Update lastRun to current timestamp
        const lastRunRef = ref(db, `${BASE}/items/${id}/lastRun`);
        await set(lastRunRef, Math.floor(Date.now() / 1000).toString());
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [items, enabled]);

  const toggleSchedule = async (value: boolean) => {
    await update(ref(db, BASE), { enabled: value });
    setEnabled(value);
  };

  const saveItem = async (id: string, item: ScheduleItem) => {
    await set(ref(db, `${BASE}/items/${id}`), item);
    setItems(prev => ({ ...prev, [id]: item }));
  };

  return { enabled, items, toggleSchedule, saveItem };
}
