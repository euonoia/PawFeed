import { ref, update } from 'firebase/database';
import { rtdb } from '../config/firebase'; 
import { DEVICE_CONFIG } from '../config/deviceConfig';

const DEVICE_ID = DEVICE_CONFIG.ID || "feeder_001";

export const ScheduleService = {
  /**
   * updateSchedule: STRICTLY for recurring automation items
   * This updates the /schedule/items path which the ESP32 checkSchedule() monitors.
   */
  updateSchedule: async (id: string, data: any) => {
    try {
      // Path targets the specific schedule item (morning/evening)
      const itemRef = ref(rtdb, `devices/${DEVICE_ID}/schedule/items/${id}`);
      
      const payload = {
        time: data.time,               // String "HH:mm"
        grams: Number(data.grams),     // Target weight for this specific meal
        active: Boolean(data.active),  // Toggle for this meal
        angle: data.angle || 90,       // Opening width for this meal
        lastRun: "0"                   // Resetting to "0" arms the ESP32 for the next match
      };

      await update(itemRef, payload);
      console.log(`[ScheduleService] ${id} meal updated.`);
      return true;
    } catch (error) {
      console.error("Schedule Update Error:", error);
      return false;
    }
  },
  toggleMasterEnabled: async (enabled: boolean) => {
    try {
      const masterRef = ref(rtdb, `devices/${DEVICE_ID}/schedule`);
      await update(masterRef, { enabled });
      return true;
    } catch (error) {
      console.error("Master Toggle Error:", error);
      return false;
    }
  }
};