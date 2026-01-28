import { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { firebaseApp } from "../config/firebase";
import { DEVICE_CONFIG } from "../config/deviceConfig";
import { ConnectivityStatus } from "../types/device";

const db = getDatabase(firebaseApp);

export function useDeviceStatus() {
  const [status, setStatus] = useState<ConnectivityStatus | null>(null);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
  const connRef = ref(db, `devices/${DEVICE_CONFIG.ID}/connectivity`);

  const unsubscribe = onValue(
    connRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        setStatus(null);
        setIsOnline(false);
        return;
      }

      const data = snapshot.val() as ConnectivityStatus;

      const now = Math.floor(Date.now() / 1000);
      const lastSeen = data?.lastSeen ?? 0;
      const reportedOnline = data?.online === true;

      const actuallyOnline =
        reportedOnline &&
        now - lastSeen <= DEVICE_CONFIG.OFFLINE_THRESHOLD_SEC;

      setStatus(data);
      setIsOnline(actuallyOnline);
    },
    (error: any) => {
     
      console.warn("Connectivity read failed:", error?.message ?? error);
      setStatus(null);
      setIsOnline(false);
    }
  );

  return () => unsubscribe();
}, []);

  return { status, isOnline };
}
