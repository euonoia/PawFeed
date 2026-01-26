import { useState } from "react";
import { rtdb, auth } from "@/config/firebase";
import { ref, get, set } from "firebase/database";

export function useClaimDevice() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const claimDevice = async (deviceId: string): Promise<boolean> => {
    if (!auth.currentUser) throw new Error("User not logged in");

    setLoading(true);
    setError(null);

    const deviceRef = ref(rtdb, `devices/${deviceId}/ownerUid`);

    try {
      const snapshot = await get(deviceRef);

      if (snapshot.exists()) {
        
        return false;
      }

      // Claim the device
      await set(deviceRef, auth.currentUser.uid);

      return true;
    } catch (err: any) {
      setError(err.message);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { claimDevice, loading, error };
}
