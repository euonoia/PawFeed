import { getCurrentWeight } from "./WeightService";
import { DEVICE_CONFIG } from "../config/deviceConfig";

export async function canDispenseFood(): Promise<boolean> {
  const weight = await getCurrentWeight();

  
  return weight <= (DEVICE_CONFIG.WEIGHT.EMPTY_THRESHOLD || 10);
}