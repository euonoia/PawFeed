import { useState } from "react";
import { rtdb, auth } from "@/config/firebase";
import { ref, get, update } from "firebase/database";

export function useClaimDevice() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const claimDevice = async (deviceId: string) => {
    setLoading(true);
    setError(null);

    try {
      const ownerRef = ref(rtdb, `devices/${deviceId}/owner`);
      const snapshot = await get(ownerRef);

      if (snapshot.exists()) {
      
        return false;
      }

      
      await update(ownerRef, { owner: auth.currentUser?.uid });

      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { claimDevice, loading, error };
}
