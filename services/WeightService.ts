import { ref, get } from "firebase/database";
import { rtdb } from "../config/firebase";
import { DEVICE_CONFIG } from "../config/deviceConfig";

export async function getCurrentWeight(): Promise<number> {
  try {
    const weightRef = ref(
      rtdb,
      `devices/${DEVICE_CONFIG.ID}/weight`
    );

    const snapshot = await get(weightRef);

    const weight = snapshot.val();

    return typeof weight === "number" ? weight : 0;
  } catch (error) {
    console.error("Failed to fetch weight:", error);
    return 0;
  }
}
