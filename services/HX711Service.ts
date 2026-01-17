import { ref, onValue } from "firebase/database";
import { rtdb } from "../config/firebase"; // use your RTDB instance
import { DEVICE_CONFIG } from "../config/deviceConfig";

/**
 * Subscribe to weight updates from the HX711 Realtime Database node
 * @param callback receives the current weight in grams
 * @returns unsubscribe function
 */
export function subscribeWeight(callback: (weight: number) => void) {
  const weightRef = ref(rtdb, DEVICE_CONFIG.PATHS.WEIGHT(DEVICE_CONFIG.ID));

  const unsubscribe = onValue(weightRef, (snapshot) => {
    const value = snapshot.val();
    callback(value ?? 0); // default to 0 if null
  });

  return unsubscribe; // call this to stop listening
}
