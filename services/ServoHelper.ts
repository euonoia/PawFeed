import { DEVICE_CONFIG } from "../config/deviceConfig";
import { ref, set } from "firebase/database";
import { rtdb } from "../config/firebase"; 
export async function dispensePortion(angle: number) {
  const deviceId = DEVICE_CONFIG.ID;

  // 1. Move servo to portion angle
  await set(ref(rtdb, DEVICE_CONFIG.PATHS.SERVO_TARGET(deviceId)), angle);

  // 2. Wait 1 second for servo to move
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 3. Move servo back to CLOSE
  await set(ref(rtdb, DEVICE_CONFIG.PATHS.SERVO_TARGET(deviceId)), DEVICE_CONFIG.PORTIONS.CLOSE);
}
