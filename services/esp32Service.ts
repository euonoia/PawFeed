import { ref, set } from "firebase/database";
import { rtdb } from "../config/firebase";
import { DEVICE_CONFIG } from "../config/deviceConfig";
import { getCurrentWeight } from "./WeightService";

const DEVICE_ID = DEVICE_CONFIG.ID;

export const moveServo = async (angle: number) => {
  if (angle < 0 || angle > 180) return;

  await set(ref(rtdb, `devices/${DEVICE_ID}/servo`), {
    targetAngle: angle,
    status: "moving",
    updatedAt: Date.now(),
  });
};

export const feedIfEmpty = async (angle: number) => {
  const weight = await getCurrentWeight();
  console.log("Current weight:", weight, "g");

  if (weight > 0) {
    throw new Error(`Cannot feed: current weight is ${weight}g`);
  }

  await moveServo(angle);
};
